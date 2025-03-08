const express = require("express");
const router = express.Router();
const videoConferenceController = require("../controllers/videoConferenceController");

// Route pour créer une nouvelle demande de vidéoconférence
router.post("/", videoConferenceController.createVideoConferenceRequest);


router.get("/", videoConferenceController.getVideoConferenceRequests);
module.exports = router;

// Update the status of a video conference request (PATCH)
router.patch("/:id", videoConferenceController.updateVideoConferenceStatus);

// Delete a video conference request (DELETE)
router.delete("/:id", videoConferenceController.deleteVideoConferenceRequest);