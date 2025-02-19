const express = require('express');
const mongoose = require('mongoose');
const betRoutes = require('./routes/bet.routes');

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use('/bets', betRoutes);

app.listen(3000, () => {
    console.log('Bet service running on port 3000');
});