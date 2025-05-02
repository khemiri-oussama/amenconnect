// models/AdminAlert.js
const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: { type: String, default: "Security" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", AlertSchema);
