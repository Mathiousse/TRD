const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('./middleware/auth.middleware');

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Initialize database
async function initializeDatabase() {
    try {
        // Drop the table if it exists
        await pool.query('DROP TABLE IF EXISTS users');
        
        // Create the users table with all required fields
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                role VARCHAR(50) DEFAULT 'user'
            );
        `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

initializeDatabase();

// Health check
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'healthy', message: 'Service is running and database is connected' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', message: 'Database connection error' });
    }
});

// Sign Up
app.post('/auth/signup', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        // Check if user exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
            [username, hashedPassword, email, role || 'user']
        );

        const user = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Sign In
app.post('/auth/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});

// Verify Token
app.get('/auth/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Authentication service running on port ${PORT}`);
});