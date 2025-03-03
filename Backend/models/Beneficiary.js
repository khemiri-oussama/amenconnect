// models/Beneficiary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BeneficiarySchema = new Schema(
  {
    // Link the beneficiary to the user (owner)
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Name of the beneficiary
    name: {
      type: String,
      required: true,
    },
    // Account number of the beneficiary
    accountNumber: {
      type: String,
      required: true,
    },
    // Bank name or institution of the beneficiary
    bankName: {
      type: String,
      required: true,
    },
    // Optional IBAN number
    IBAN: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);
