const Bet = require('../models/Bet');

exports.createBet = async (req, res) => {
    try {
        console.log('Creating bet with data:', req.body);
        
        // Validate required fields
        const { matchId, amount, prediction, odds, userId } = req.body;
        if (!matchId || !amount || !prediction || !odds || !userId) {
            console.error('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create bet
        const bet = await Bet.create({
            matchId: matchId.toString(),
            amount: Number(amount),
            prediction,
            odds: Number(odds),
            userId: userId.toString()
        });

        console.log('Successfully created bet:', bet);
        res.status(201).json(bet);
    } catch (error) {
        console.error('Error creating bet:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserBets = async (req, res) => {
    try {
        const bets = await Bet.find({ userId: req.params.userId });
        res.json(bets);
    } catch (error) {
        console.error('Error getting user bets:', error);
        res.status(500).json({ error: 'Server error' });
    }
};