const express = require('express');
const router = express.Router();
const { createBet, getUserBets } = require('../controllers/bet.controller');

router.post('/', createBet);
router.get('/user/:userId', getUserBets);

module.exports = router;