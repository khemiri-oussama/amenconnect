// routes/alerts.js
const express = require('express');
const router = express.Router();
const Alert = require('../models/AdminAlert');

router.get('/', async (req, res) => {
  try {
    // Retrieve the latest 10 alerts, sorted by creation time
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(10);
    res.json({ alerts });
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
