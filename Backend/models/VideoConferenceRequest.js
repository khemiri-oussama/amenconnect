// models/VideoConferenceRequest.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const VideoConferenceRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // This will generate a unique roomId automatically
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VideoConferenceRequest", VideoConferenceRequestSchema);
