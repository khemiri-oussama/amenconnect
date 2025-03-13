// models/LoginAttempt.js
const mongoose = require("mongoose");

const LoginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  success: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }  // Automatically stores the date and time of the attempt
});

module.exports = mongoose.model("LoginAttempt", LoginAttemptSchema);
