const express = require("express");
const router = express.Router();
const virementController = require("../controllers/virementController");

// Endpoint to create a new virement
router.post("/", virementController.createVirement);

module.exports = router;
