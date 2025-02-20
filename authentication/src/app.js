const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Authentication service running on port ${PORT}`);
});
