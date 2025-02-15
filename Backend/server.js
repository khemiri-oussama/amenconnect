const express = require('express');
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;


https.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server running on https://localhost:${PORT}`);
});
