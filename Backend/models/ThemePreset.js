const mongoose = require("mongoose");
const { Schema } = mongoose;

const themeSchema = new Schema({
  kioskPrimary: { type: String, required: true },
  kioskPrimaryDark: { type: String, required: true },
  kioskPrimaryLight: { type: String, required: true },
  kioskPrimaryText: { type: String, required: true },
  kioskSecondary: { type: String, required: true },
  kioskSecondaryDark: { type: String, required: true },
  kioskSecondaryLight: { type: String, required: true },
  kioskAccent: { type: String, required: true },
  kioskAccentDark: { type: String, required: true },
  kioskAccentLight: { type: String, required: true },
  kioskBackground: { type: String, required: true },
  kioskSurface: { type: String, required: true },
  kioskBorder: { type: String, required: true },
  kioskTextMuted: { type: String, required: true }
});

const themePresetSchema = new Schema({
  name: { type: String, required: true },
  theme: { type: themeSchema, required: true },
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model("ThemePreset", themePresetSchema);
