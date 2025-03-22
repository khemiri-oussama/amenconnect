// models/Kiosk.js
const mongoose = require('mongoose');

const KioskSchema = new mongoose.Schema({
  tote: { type: String },
  status: { type: String, required: true },
  SN: { type: String, required: true, unique: true },
  version: { type: String, required: true },
  temperature: { type: Number, default: 0 },
  location: { type: String, required: true },
  apiUrl: { type: String, required: true, default: "http://127.0.0.1:3000" },
  agencyName: { type: String, required: true },
  enabled: { type: Boolean, default: false },
  // Add last_heartbeat as a Number (Unix timestamp in seconds)
  last_heartbeat: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Kiosk', KioskSchema);

