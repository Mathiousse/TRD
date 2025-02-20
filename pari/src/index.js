const express = require('express');
const mongoose = require('mongoose');
const betRoutes = require('./routes/bet.routes');
const amqp = require('amqplib');

const app = express();

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Use bet routes
app.use('/bets', betRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

let channel, connection;

// Connect to RabbitMQ
async function connectQueue() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('bet_updates');
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}

connectQueue();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'trd'
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Health check endpoint
app.get('/health', async (req, res) => {
    const healthy = mongoose.connection.readyState === 1 && channel !== undefined;
    if (healthy) {
        res.status(200).json({ 
            status: 'healthy', 
            message: 'Service is running, database and message queue are connected' 
        });
    } else {
        res.status(500).json({ 
            status: 'unhealthy', 
            message: 'Service has connection issues' 
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Bet service running on port ${port}`);
});