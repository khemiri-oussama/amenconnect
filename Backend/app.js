const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); // ✅ Ensure correct path

const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes); // ✅ Correct route mounting

module.exports = app; // ✅ Ensure `app` is exported
