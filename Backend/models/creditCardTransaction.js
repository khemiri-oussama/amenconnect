// models/creditCardTransaction.js
const mongoose = require("mongoose");

const creditCardTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  description: { type: String, default: "" },
  // Add any other fields that are specific to a credit card transaction,
  // such as merchant, currency, etc.
  
  // Link back to the credit card (Carte)
  carteId: { type: mongoose.Schema.Types.ObjectId, ref: "Carte", required: true }
}, { collection: "creditCardTransactions" });

module.exports = mongoose.model("CreditCardTransaction", creditCardTransactionSchema);
