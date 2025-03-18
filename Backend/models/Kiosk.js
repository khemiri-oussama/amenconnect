// models/Kiosk.js
const mongoose = require('mongoose');

const KioskSchema = new mongoose.Schema({
  tote: { type: String, required: false },
  status: { type: String, required: true },
  SN: { type: String, required: true, unique: true }, // uniqueness enforced
  version: { type: String, required: true },
  temperature: { type: Number, default: 0 },
  location: { type: String, required: true },
  agencyName: { type: String, required: true },
  enabled: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model('Kiosk', KioskSchema);
