// routes/budgetCategoryRoutes.js
const express = require("express");
const router = express.Router();
const budgetCategoryController = require("../controllers/budgetCategoryController");

router.get("/", budgetCategoryController.getCategories);

// POST a new category (expects userId in the request body)
router.post("/", budgetCategoryController.createCategory);

// PUT update a category by ID
router.put("/:id", budgetCategoryController.updateCategory);

// DELETE a category by ID
router.delete("/:id", budgetCategoryController.deleteCategory);

module.exports = router;
