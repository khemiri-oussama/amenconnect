// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ipRoutes = require('./routes/ipRoutes');
const forgotPassword = require('./routes/forgotPasswordRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:8200',
  credentials: true,
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/password', forgotPassword);
app.use('/api/ip', ipRoutes);
// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

module.exports = app;
