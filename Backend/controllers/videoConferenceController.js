// controllers/videoConferenceController.js
const VideoConferenceRequest = require("../models/VideoConferenceRequest");
const AdminNotification = require("../models/AdminNotification");

exports.updateVideoConferenceStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, roomId } = req.body;
      // Allow only status "active" or "completed" for updates
      if (!["active", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const updatedConference = await VideoConferenceRequest.findByIdAndUpdate(
        id,
        { status, roomId },
        { new: true }
      );
      res.status(200).json({ message: "Status updated successfully", conference: updatedConference });
    } catch (error) {
      next(error);
    }
  };
  exports.deleteVideoConferenceRequest = async (req, res, next) => {
    try {
      const { id } = req.params;
      await VideoConferenceRequest.findByIdAndDelete(id);
      res.status(200).json({ message: "Video conference request deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
    

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
  
      // Create a new video conference request
      const newRequest = new VideoConferenceRequest({
        name,
        email,
        subject,
        phone,
        roomId,
      });
  
      const savedRequest = await newRequest.save();
  
      // Create an admin notification record for the new request
      const notificationMessage = `Nouvelle demande de vidéoconférence de ${name} (Sujet: ${subject}).`;
      const adminNotification = new AdminNotification({
        message: notificationMessage,
        requestId: savedRequest._id,
      });
      await adminNotification.save();
  
      return res.status(201).json({
        message: "Demande de vidéoconférence créée avec succès.",
        request: savedRequest,
      });
    } catch (error) {
      next(error);
    }
  };
