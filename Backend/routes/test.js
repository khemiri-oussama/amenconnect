const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ message: '✅ Database connection is active' });
  } catch (error) {
    res.status(500).json({ message: '❌ Database connection failed', error });
  }
});

module.exports = router;
