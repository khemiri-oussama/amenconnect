// models/BudgetCategory.js
const mongoose = require("mongoose");

const BudgetCategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure you have a corresponding User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetCategory", BudgetCategorySchema);
