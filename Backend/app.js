const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middleware de sécurité et de parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Exemple de route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend sécurisé!');
});

module.exports = app;
