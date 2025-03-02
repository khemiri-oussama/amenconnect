const express = require("express");
const { makeVirement } = require("../controllers/virementController");
const jwt = require("../middleware/auth"); // your JWT middleware
const router = express.Router();

// Create a virement (secured route with JWT verification)
router.post("/api/virements", jwt, makeVirement);

module.exports = router;
