// routes/systemStatsRoute.js
const express = require("express");
const cors = require("cors");
const router = express.Router();
const systemStatsController = require('../controllers/systemStatsController');

// Enable CORS for all requests on this router
router.use(cors({
  origin: "*", // or replace "*" with your allowed origin, e.g., "http://localhost:3000"
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Define the GET endpoint for system stats
router.get('/', systemStatsController.getSystemStats);

module.exports = router;
