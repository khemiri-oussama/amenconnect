// models/Virement.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VirementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    beneficiaryId: {
      type: Schema.Types.ObjectId,
      ref: 'Beneficiary', // Adjust if you have a Beneficiary model
      required: true,
    },
    beneficiaryName: {
      type: String,
      required: true,
    },
    accountFrom: {
      type: String,
      required: true,
    },
    accountTo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    // For scheduled transfers, the following fields are optional:
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'once',
    },
    nextDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Virement', VirementSchema);
