// routes/auditLogsRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const logFilePath = path.join(__dirname, '..', 'admin-actions.log');
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read log file" });
    }
    // Assume each line is a JSON object
    const logs = data
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (err) {
          return null;
        }
      })
      .filter((log) => log !== null);
    res.json({ logs });
  });
});

module.exports = router;
