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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Compte", CompteSchema);
