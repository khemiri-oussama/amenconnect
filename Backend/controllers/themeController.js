// controllers/themeController.js
const ThemeSetting = require('../models/ThemeSetting');
const ThemePreset = require("../models/ThemePreset");

// Get all theme presets
exports.getPresets = async (req, res) => {
  try {
    const presets = await ThemePreset.find();
    res.status(200).json(presets);
  } catch (error) {
    console.error("Error fetching presets:", error);
    res.status(500).json({ error: "Error fetching theme presets" });
  }
};

// Add a new theme preset (custom themes)
exports.addPreset = async (req, res) => {
  const { name, theme } = req.body;
  try {
    const newPreset = new ThemePreset({
      name,
      theme,
      isDefault: false // Custom presets are not default
    });
    const savedPreset = await newPreset.save();
    res.status(201).json(savedPreset);
  } catch (error) {
    console.error("Error adding preset:", error);
    res.status(500).json({ error: "Error adding theme preset" });
  }
};

// Update a theme preset's name
exports.updatePreset = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedPreset = await ThemePreset.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedPreset) {
      return res.status(404).json({ error: "Preset not found" });
    }
    res.status(200).json(updatedPreset);
  } catch (error) {
    console.error("Error updating preset:", error);
    res.status(500).json({ error: "Error updating theme preset" });
  }
};

// Delete a custom theme preset
exports.deletePreset = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPreset = await ThemePreset.findByIdAndDelete(id);
    if (!deletedPreset) {
      return res.status(404).json({ error: "Preset not found" });
    }
    res.status(200).json({ message: "Preset deleted successfully" });
  } catch (error) {
    console.error("Error deleting preset:", error);
    res.status(500).json({ error: "Error deleting theme preset" });
  }
};
exports.updateVariables = async (req, res) => {
    const { css } = req.body;
  
    if (!css) {
      return res.status(400).json({ error: 'CSS content is required.' });
    }
  
    try {
      const updatedSetting = await ThemeSetting.findOneAndUpdate(
        {},
        { css },
        { upsert: true, new: true }
      );
      return res
        .status(200)
        .json({ message: 'Theme settings updated successfully.', data: updatedSetting });
    } catch (error) {
      console.error('Error updating theme settings:', error);
      return res.status(500).json({ error: 'Failed to update theme settings.' });
    }
  };
  

  exports.getVariables = async (req, res) => {
    try {
      const themeSetting = await ThemeSetting.findOne({});
      if (!themeSetting) {
        return res.status(404).json({ error: 'No theme setting found.' });
      }
      return res.status(200).json({ css: themeSetting.css });
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      return res.status(500).json({ error: 'Failed to fetch theme settings.' });
    }
  };
