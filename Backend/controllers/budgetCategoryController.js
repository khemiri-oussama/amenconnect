// controllers/budgetCategoryController.js
const BudgetCategory = require("../models/BudgetCategory");

// Get all categories for a given user
exports.getCategories = async (req, res) => {
  // Expect userId in the query string: /api/categories?userId=...
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing user id" });
  }
  try {
    const categories = await BudgetCategory.find({ userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { userId, name, limit, color } = req.body;
  if (!userId || !name || !limit || !color) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newCategory = new BudgetCategory({
      userId,
      name,
      limit,
      color,
      current: 0, // default value
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
};

// Update a category by ID (optional: verify the category belongs to the user)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  // Optionally, you can compare req.body.userId or req.user.id with the document's userId
  try {
    const updatedCategory = await BudgetCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete a category by ID (optional: verify the category belongs to the user)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await BudgetCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};
