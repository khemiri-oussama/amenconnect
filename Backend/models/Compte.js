// models/Compte.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    numéroCompte: {
      type: String,
      required: true,
      unique: true
    },
    solde: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      required: true
    },
    avecChéquier: {
      type: Boolean,
      default: false
    },
    avecCarteBancaire: {
      type: Boolean,
      default: false
    },
    modalitésRetrait: {
      type: String
    },
    conditionsGel: {
      type: String
    },
    historique: {
      type: Array,
      default: []
    },
    RIB: {
      type: String
    },
    IBAN: {
      type: String
    },
    domiciliation: {
      type: String
    },
    // New fields for expenses tracking
    monthlyExpenses: {
      type: Number,
      default: 0
    },
    lastMonthExpenses: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Compte", CompteSchema);
