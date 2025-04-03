// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Define a POST endpoint for /chat
router.post("/", chatController.chat);

module.exports = router;
