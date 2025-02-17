const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ipRoutes = require("./routes/ipRoutes");
const app = express();

app.use(express.json());
app.use(cors());


app.use(cors({
  origin: "http://http://192.168.1.105:8200", 
  credentials: true
}));
app.use('/api/auth', authRoutes);
app.use("/api/ip", ipRoutes);
module.exports = app;
