const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'trd'
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Match Schema
const matchSchema = new mongoose.Schema({
    homeTeam: String,
    awayTeam: String,
    date: Date,
    status: {
        type: String,
        enum: ['scheduled', 'live', 'finished'],
        default: 'scheduled'
    },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    }
});

const Match = mongoose.model('Match', matchSchema);

// Health check endpoint
app.get('/health', (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).json({ status: 'healthy', message: 'Service is running and database is connected' });
    } else {
        res.status(500).json({ status: 'unhealthy', message: 'Database connection error' });
    }
});

// Basic match endpoints
app.post('/matches', async (req, res) => {
    try {
        const { homeTeam, awayTeam, date } = req.body;
        const match = new Match({
            homeTeam,
            awayTeam,
            date: new Date(date)
        });
        await match.save();
        res.status(201).json(match);
    } catch (error) {
        console.error('Create match error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/matches', async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/matches/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (error) {
        console.error('Get match error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.patch('/matches/:id', async (req, res) => {
    try {
        const { status, score } = req.body;
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            { status, score },
            { new: true }
        );
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (error) {
        console.error('Update match error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Match service running on port ${PORT}`);
});
