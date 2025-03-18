// models/Kiosk.js
const mongoose = require('mongoose');

// In models/Kiosk.js (add a new field)
const KioskSchema = new mongoose.Schema({
  tote: { type: String },
  status: { type: String, required: true },
  SN: { type: String, required: true, unique: true },
  version: { type: String, required: true },
  temperature: { type: Number, default: 0 },
  location: { type: String, required: true }, // could be used as IP/hostname
  apiUrl: { type: String, required: true, default: "http://127.0.0.1:3000"},   // new: API endpoint of the totem (e.g., "http://192.168.1.100:3001")
  agencyName: { type: String, required: true },
  enabled: { type: Boolean, default: false }
}, { timestamps: true });



module.exports = mongoose.model('Kiosk', KioskSchema);
