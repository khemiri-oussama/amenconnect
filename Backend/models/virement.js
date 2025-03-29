const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const virementSchema = new Schema({
  fromAccount: { type: Schema.Types.ObjectId, ref: "Compte", required: true },
  toAccount: { type: Schema.Types.ObjectId, ref: "Compte", required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: "" },
  status: { type: String, default: "Pending" }, // Options: Pending, Completed, Failed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Virement", virementSchema);
