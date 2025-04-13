// routes/budgetCategoryRoutes.js
const express = require("express")
const router = express.Router()
const budgetCategoryController = require("../controllers/budgetCategoryController")

// Get all categories for a given user by sending a query parameter ?userId=...
router.get("/", budgetCategoryController.getCategories)

// Create a new category (expects userId in the request body)
router.post("/", budgetCategoryController.createCategory)

// **Add the updateBudget route before the dynamic route**
router.put("/updateBudget", budgetCategoryController.updateBudget)

// Update a category by its ID
router.put("/:id", budgetCategoryController.updateCategory)

// Delete a category by its ID
router.delete("/:id", budgetCategoryController.deleteCategory)

module.exports = router
