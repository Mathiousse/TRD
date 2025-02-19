const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    matchId: { type: String, required: true },
    amount: { type: Number, required: true },
    odds: { type: Number, required: true },
    prediction: { type: String, enum: ['home_win', 'away_win', 'draw'], required: true },
    status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);