// controllers/videoConferenceController.js
const VideoConferenceRequest = require("../models/VideoConferenceRequest");

exports.getVideoConferenceRequests = async (req, res, next) => {
    try {
      const requests = await VideoConferenceRequest.find().sort({ createdAt: -1 });
      res.status(200).json({
        message: "Video conference requests retrieved successfully.",
        requests,
      });
    } catch (error) {
      next(error);
    }
  };

exports.createVideoConferenceRequest = async (req, res, next) => {
  try {
    const { name, email, subject, phone, roomId } = req.body;

    if (!name || !email || !subject || !phone || !roomId) {
      return res.status(400).json({ message: "Tous les champs sont requis, y compris roomId." });
    }

    // Create a new request with the provided roomId from the client
    const newRequest = new VideoConferenceRequest({
      name,
      email,
      subject,
      phone,
      roomId,
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Demande de vidéoconférence créée avec succès.",
      request: savedRequest,
    });
  } catch (error) {
    next(error);
  }
};
