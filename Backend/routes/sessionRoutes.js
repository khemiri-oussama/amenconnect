const express = require('express');
const router = express.Router();
const adminpassport = require('../config/adminPassport'); // Use the admin strategy
const Session = require('../models/Session');

// Protect endpoints with the admin JWT strategy
router.use(adminpassport.authenticate('admin-jwt', { session: false }));

// GET /api/sessions - Retrieve all sessions (users and admins)
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).json({ message: "Error retrieving sessions", error: error.message });
  }
});

// DELETE /api/sessions/:sessionId - Terminate a specific session
router.delete('/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      await Session.deleteOne({ sessionId });
      res.status(200).json({ message: "Session terminated successfully." });
    } catch (error) {
      console.error("Error terminating session:", error);
      res.status(500).json({ message: "Error terminating session", error: error.message });
    }
  });
  

module.exports = router;
