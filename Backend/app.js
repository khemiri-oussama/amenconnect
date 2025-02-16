const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes'); // Import the auth routes

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);  // All auth routes will start with /api/auth

// Default Route
app.get('/', (req, res) => {
  res.send('Bienvenue sureeee le backend sécurisé!');
});

module.exports = app;
