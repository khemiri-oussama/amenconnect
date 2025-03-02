//models/virement.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the "virement" collection
const virementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceAccount: { type: String, required: true },
  destinationAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TND' },
  transferDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transferType: { type: String, enum: ['internal', 'external'], required: true },
  reason: String,
  beneficiaryName: String,
  beneficiaryBank: String
}, { timestamps: true });

// Export the model using CommonJS syntax
module.exports = mongoose.model('virement', virementSchema);
