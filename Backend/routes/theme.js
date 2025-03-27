// routes/theme.js
const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

// POST endpoint (for updating theme variables)
router.post('/update-variables', themeController.updateVariables);

// GET endpoint (for retrieving theme variables)
router.get('/theme-variables', themeController.getVariables);

module.exports = router;
