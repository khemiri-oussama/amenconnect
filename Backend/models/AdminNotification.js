const mongoose = require("mongoose");

const AdminNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Nouvelle demande de vidéoconférence",
  },
  message: {
    type: String,
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideoConferenceRequest",
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AdminNotification", AdminNotificationSchema);
