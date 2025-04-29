// routes/chatRoutes.js
const express  = require('express');
const passport = require('../config/passport');
const { chat } = require('../controllers/chatController');
const router   = express.Router();

router.post(
  '/', 
  passport.authenticate('jwt', { session: false }),  // ← protect it
  chat
);

module.exports = router;
