//models/Cartes.js
const mongoose = require("mongoose");

const creditCardTransactionSubschema = new mongoose.Schema({
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  description: { type: String, default: "" },
  currency: { type: String, default: "TND" },
  merchant: String,
  status: String
});

const carteSchema = new mongoose.Schema({
  CardNumber: { type: String, required: true },
  ExpiryDate: { type: String, default: "" },
  CardHolder: { type: String, required: true },
  CreatedAt: { type: String, default: "" },
  UpdatedAt: { type: String, default: "" },
  comptesId: { type: mongoose.Schema.Types.ObjectId, ref: "Compte", required: true },
  TypeCarte: { type: String, default: "" },
  creditCardTransactions: [creditCardTransactionSubschema],
  monthlyExpenses: {
    current: { type: Number, default: 0 },
    limit: { type: Number, default: 5000000 }
  },
  atmWithdrawal: {
    current: { type: Number, default: 0 },
    limit: { type: Number, default: 1000000 }
  },
  pendingTransactions: {
    amount: { type: Number, default: 0 },
    count: { type: Number, default: 3 }
  },
  cardStatus: { type: String, default: "Active" }
}, { collection: "carte" });

module.exports = mongoose.model("Carte", carteSchema);