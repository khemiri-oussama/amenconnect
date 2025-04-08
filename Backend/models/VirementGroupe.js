const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const virementGroupeSchema = new Schema(
  {
    fromAccount: { type: Schema.Types.ObjectId, ref: "Compte", required: true },
    // Update beneficiary field to accept a string (the RIB)
    virements: [
      {
        beneficiary: { type: String, required: true },
        amount: { type: Number, required: true },
        motif: { type: String },
      },
    ],
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.VirementGroupe || mongoose.model("VirementGroupe", virementGroupeSchema);
