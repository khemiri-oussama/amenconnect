const express = require("express");
const router = express.Router();
const AdminNotification = require("../models/AdminNotification");

// GET all admin notifications sorted by creation date
router.post("/", async (req, res, next) => {
  try {
    const notification = await AdminNotification.create(req.body);
    
    // Emit the new notification to all connected clients
    const io = req.app.locals.io;
    io.emit("new_notification", {
      id: notification._id,
      title: notification.title || "Nouvelle demande de vidéoconférence",
      message: notification.message,
      time: new Date(notification.createdAt).toLocaleString(),
      read: notification.read,
    });

    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
});

module.exports = router;