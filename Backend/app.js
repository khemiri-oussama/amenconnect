// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ipRoutes = require('./routes/ipRoutes');

const app = express();

// Set security-related HTTP headers
app.use(helmet());

// Parse incoming JSON requests
app.use(express.json());

// Configure CORS (adjust CLIENT_ORIGIN in your .env file as needed)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:8200',
  credentials: true,
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/ip', ipRoutes);

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

module.exports = app;
