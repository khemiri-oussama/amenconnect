const https = require('https');
const fs = require('fs');
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Connexion à MongoDB
connectDB();

// Options SSL/TLS
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Démarrage du serveur HTTPS
const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Le serveur est lancé sur https://localhost:${PORT}`);
});
