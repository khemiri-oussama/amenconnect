const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const ipRoutes = require('./routes/ipRoutes');
const forgotPassword = require('./routes/forgotPasswordRoutes');

// Import and initialize Passport
const passport = require('./config/passport');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:8200',
  credentials: true,
}));

// Initialize Passport (we're not using sessions with JWT)
app.use(passport.initialize());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/password', forgotPassword);
app.use('/api/ip', ipRoutes);
app.use('/auth', require('./routes/authRoutes'));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

module.exports = app;
