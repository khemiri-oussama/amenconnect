const mongoose = require("mongoose");

const KioskSchema = new mongoose.Schema({
  // Use only the "tote" field as the unique, required identifier.
  tote: { type: String, required: true, unique: true },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  version: { type: String, default: "1.4" },
  temperature: { type: Number, default: 0 },
  location: { type: String },
  agencyName: { type: String },
  enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("Kiosk", KioskSchema);
