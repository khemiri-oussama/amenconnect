// controllers/videoConferenceController.js
const VideoConferenceRequest = require("../models/VideoConferenceRequest");
const AdminNotification = require("../models/AdminNotification");

/**
 * Update the status of a video conference (only 'active' or 'completed').
 */
exports.updateVideoConferenceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, roomId } = req.body;

    // Validate status
    if (!["active", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedConference = await VideoConferenceRequest.findByIdAndUpdate(
      id,
      { status, roomId },
      { new: true }
    );

    if (!updatedConference) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      conference: updatedConference,
    });
  } catch (error) {
    console.error("Error updating conference status:", error);
    return next(error);
  }
};

/**
 * Delete a video conference request by ID.
 */
exports.deleteVideoConferenceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await VideoConferenceRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Video conference request deleted successfully" });
  } catch (error) {
    console.error("Error deleting conference request:", error);
    return next(error);
  }
};

/**
 * Retrieve all video conference requests, sorted by creation time desc.
 */
exports.getVideoConferenceRequests = async (req, res, next) => {
  try {
    const requests = await VideoConferenceRequest.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Video conference requests retrieved successfully.",
      requests,
    });
  } catch (error) {
    console.error("Error fetching conference requests:", error);
    return next(error);
  }
};

/**
 * Create a new video conference request and notify admins.
 */
exports.createVideoConferenceRequest = async (req, res, next) => {
  try {
    const { name, email, subject, phone, roomId } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !phone || !roomId) {
      return res.status(400).json({ message: "Tous les champs sont requis, y compris roomId." });
    }

    // Save the request
    const newRequest = new VideoConferenceRequest({ name, email, subject, phone, roomId });
    const savedRequest = await newRequest.save();

    // Create admin notification
    const notificationTitle = "Nouvelle demande de vidéoconférence";
    const notificationMessage = `Nouvelle demande de vidéoconférence de ${name} (Sujet: ${subject}).`;
    const adminNotification = new AdminNotification({
      title: notificationTitle,
      message: notificationMessage,
      requestId: savedRequest._id,
    });
    const savedNotification = await adminNotification.save();

    // Emit over socket.io, if available
    const io = req.app.locals.io;
    if (io && typeof io.emit === 'function') {
      io.emit("new_notification", {
        id: savedNotification._id,
        title: savedNotification.title,
        message: savedNotification.message,
        time: savedNotification.createdAt,
        read: savedNotification.read,
        requestId: savedNotification.requestId,
      });
    }

    return res.status(201).json({
      message: "Demande de vidéoconférence créée avec succès.",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error creating conference request:", error);
    return next(error);
  }
};
