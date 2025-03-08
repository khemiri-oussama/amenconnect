const express = require("express");
const router = express.Router();
const videoConferenceController = require("../controllers/videoConferenceController");

// Route pour créer une nouvelle demande de vidéoconférence
router.post("/", videoConferenceController.createVideoConferenceRequest);

module.exports = router;
