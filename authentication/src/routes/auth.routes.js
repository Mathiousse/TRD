const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../middleware/auth.middleware');
const jwt = require('jsonwebtoken');

// Increase request timeout
router.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds
    res.setTimeout(30000);
    next();
});

// In-memory user store (replace with database in production)
const users = [];

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        // Check if user already exists
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            email,
            role: role || 'user'
        };

        users.push(user);

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
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = users.find(u => u.username === username);
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
router.get('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No token provided in request');
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully for user:', decoded.username);
        res.json(decoded);
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
});

router.get('/health', (req, res) => {
    res.json({ message: 'Authentication service is healthy' });
});

module.exports = router;