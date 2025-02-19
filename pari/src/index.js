const express = require('express');
const mongoose = require('mongoose');
const betRoutes = require('./routes/bet.routes');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

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

app.use('/bets', betRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bet service running on port ${PORT}`);
});