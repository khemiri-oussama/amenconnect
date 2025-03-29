const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const virementGroupeSchema = new Schema({
  fromAccount: { type: Schema.Types.ObjectId, ref: "Compte", required: true },
  // An array of individual transfers in the group
  virements: [
    {
      beneficiary: { type: Schema.Types.ObjectId, ref: "Beneficiaire", required: true },
      amount: { type: Number, required: true },
      motif: { type: String },
    }
  ],
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("VirementGroupe", virementGroupeSchema);
