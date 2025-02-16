const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const testRoute = require('./routes/test');
app.use('/api', testRoute);

// Default Route
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend sécurisé!');
});

module.exports = app;
