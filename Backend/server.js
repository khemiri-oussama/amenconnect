const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const app = require('./app'); 

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
