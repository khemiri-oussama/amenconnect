const express = require("express");
const { makeVirement } = require("../controllers/virementController");
const router = express.Router();

// Create a virement
router.post("/api/virements", makeVirement);

module.exports = router;
