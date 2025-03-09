// controllers/budgetCategoryController.js
const BudgetCategory = require("../models/BudgetCategory");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await BudgetCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, limit, color } = req.body;
  if (!name || !limit || !color) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newCategory = new BudgetCategory({
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

// Update a category by ID
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
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

// Delete a category by ID
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
