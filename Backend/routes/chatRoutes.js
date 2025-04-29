// routes/chatRoutes.js
const express  = require('express');
const passport = require('../config/passport');
const { chat } = require('../controllers/chatController');
const Chat     = require('../models/Chat');
const router   = express.Router();

// POST /api/chat → existing, protected handler
router.post(
  "/",
  passport.authenticate('jwt', { session: false }),
  chat
);

// GET /api/chat → return today’s messages
router.get(
  "/",
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // build YYYY-MM-DD key the same way
      const todayKey = new Date().toISOString().slice(0, 10);
      const chatDoc = await Chat.findOne({
        user: req.user._id,
        date: todayKey
      });

      // if none, return empty array
      return res.json(chatDoc?.messages || []);
    } catch (err) {
      console.error("Error fetching today's chat:", err);
      return res.status(500).json({ error: "Could not load chat history." });
    }
  }
);

module.exports = router;
