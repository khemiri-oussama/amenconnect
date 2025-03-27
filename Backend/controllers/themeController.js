// controllers/themeController.js
const ThemeSetting = require('../models/ThemeSetting');
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
