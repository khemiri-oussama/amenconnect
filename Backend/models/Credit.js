// File: models/Credit.js
const mongoose = require('mongoose');

// Schéma de demande de crédit
const creditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String,
    enum: ['Auto', 'Immobilier', 'Études', 'Liquidité'],
    required: true
  },
  montant: { type: Number, required: true },
  duree: { type: Number, required: true },
  status: {
    type: String,
    enum: ['received', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Credit', creditSchema);