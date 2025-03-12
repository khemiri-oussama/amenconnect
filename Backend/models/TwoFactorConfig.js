// models/TwoFactorConfig.js
const mongoose = require("mongoose");

const TwoFactorConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Admin", depending on your user model
    required: true,
    unique: true, // one config per user
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
  smsEnabled: {
    type: Boolean,
    default: false,
  },
  emailEnabled: {
    type: Boolean,
    default: false,
  },
  googleAuthEnabled: {
    type: Boolean,
    default: false,
  },
  // If you plan to support Google Authenticator, you might store a secret:
  googleAuthSecret: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TwoFactorConfig", TwoFactorConfigSchema);
