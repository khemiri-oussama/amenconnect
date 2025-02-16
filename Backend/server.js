const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const app = require('./app'); 

connectDB();
app.use(express.json());
app.use(cors());
// ✅ Import `app` from `app.js`

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

