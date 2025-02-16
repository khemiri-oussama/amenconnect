const express = require('express');
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/db');
require('dotenv').config();

const app = require('./app');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Use HTTP for local dev (comment this block for HTTPS)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Uncomment this block if you have SSL certificates
// const options = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert'),
// };
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`🚀 Secure Server running on https://localhost:${PORT}`);
// });
