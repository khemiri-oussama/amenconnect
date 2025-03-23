// models/incident.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incidentSchema = new Schema({
  totemId: { type: String, required: true },
  type: { type: String, enum: ['Hardware Failure', 'Software Error', 'Other'], required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);
