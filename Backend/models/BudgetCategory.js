// models/BudgetCategory.js
const mongoose = require("mongoose");

const BudgetCategorySchema = new mongoose.Schema(
  {
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
    // Uncomment the following lines if you need to associate categories with a user:
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetCategory", BudgetCategorySchema);
