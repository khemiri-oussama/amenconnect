// models/Budget.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    max: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
