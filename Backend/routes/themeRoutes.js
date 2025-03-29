const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");

// GET /api/theme/presets - List all presets
router.get("/presets", themeController.getPresets);

// POST /api/theme/presets - Add a new preset
router.post("/presets", themeController.addPreset);

// PATCH /api/theme/presets/:id - Update a preset's name
router.patch("/presets/:id", themeController.updatePreset);

// DELETE /api/theme/presets/:id - Delete a preset
router.delete("/presets/:id", themeController.deletePreset);

module.exports = router;
