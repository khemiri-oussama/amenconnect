// models/ThemeSetting.js
const mongoose = require('mongoose');

const themeSettingSchema = new mongoose.Schema({
  css: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ThemeSetting', themeSettingSchema);
