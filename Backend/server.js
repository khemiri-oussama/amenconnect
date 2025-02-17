const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const app = require('./app'); 
const helmet = require("helmet");
app.use(helmet());

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:8200", credentials: true }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
