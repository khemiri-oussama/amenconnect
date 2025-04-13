// controllers/budgetCategoryController.js
const BudgetCategory = require("../models/BudgetCategory")

// Get all categories for a given user. Expects userId to be provided as a query parameter.
exports.getCategories = async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ error: "Missing user id" })
  }
  try {
    const categories = await BudgetCategory.find({ userId })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" })
  }
}

// Create a new budget category.
exports.createCategory = async (req, res) => {
  const { userId, name, limit, color } = req.body
  if (!userId || !name || !limit || !color) {
    return res.status(400).json({ error: "Missing required fields" })
  }
  try {
    const newCategory = new BudgetCategory({
      userId,
      name,
      limit,
      color,
      current: 0, // default value
    })
    await newCategory.save()
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(500).json({ error: "Error creating category" })
  }
}

// Update a category by its ID.
exports.updateCategory = async (req, res) => {
  const { id } = req.params
  try {
    const updatedCategory = await BudgetCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" })
    }
    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(500).json({ error: "Error updating category" })
  }
}

// Delete a category by its ID.
exports.deleteCategory = async (req, res) => {
  const { id } = req.params
  try {
    const deletedCategory = await BudgetCategory.findByIdAndDelete(id)
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" })
    }
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" })
  }
}

// Update a user's budget category after a payment.
// Only the category belonging to the specified user and matching merchantType will be updated.
exports.updateBudget = async (req, res) => {
  const { userId, merchantType, amount } = req.body
  try {
    const category = await BudgetCategory.findOne({ userId, name: merchantType })
    if (!category) {
      return res.status(404).json({ message: "Category not found for this user" })
    }
    // Update the budget "current" value. Depending on your logic, this could track expenses.
    // For example, adding the paid amount to the current expense total:
    category.current += amount
    await category.save()
    res.status(200).json({ message: "Budget updated", category })
  } catch (error) {
    res.status(500).json({ error: "Error updating budget category" })
  }
}
