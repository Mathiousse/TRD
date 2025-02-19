const Bet = require('../models/Bet');

exports.createBet = async (req, res) => {
    try {
        const bet = await Bet.create(req.body);
        res.status(201).json(bet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserBets = async (req, res) => {
    try {
        const bets = await Bet.find({ userId: req.params.userId });
        res.json(bets);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};