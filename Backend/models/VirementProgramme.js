const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const virementProgrammeSchema = new Schema({
  fromAccount: { type: Schema.Types.ObjectId, ref: "Compte", required: true },
  toAccount: { type: Schema.Types.ObjectId, ref: "Beneficiaire", required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  frequency: {
    type: String,
    enum: ["quotidien", "hebdomadaire", "mensuel", "trimestriel", "annuel"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  occurrences: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("VirementProgramme", virementProgrammeSchema);
