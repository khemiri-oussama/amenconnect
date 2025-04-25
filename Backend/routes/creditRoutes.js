const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

// Get all credits for a user
router.get('/', creditController.getUserCredits);

// Get specific credit by ID
router.get('/:id', creditController.getCreditById);

// Create new credit request
router.post('/', creditController.demandeCredit);

module.exports = router;