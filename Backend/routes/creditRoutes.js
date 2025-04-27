const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

// Get all credits (admin)
router.get('/all', creditController.getAllCredits);

// Get all credits for a specific user
router.get('/', creditController.getUserCredits);

// Get a specific credit by ID
router.get('/:id', creditController.getCreditById);

// Create a new credit request
router.post('/', creditController.demandeCredit);

router.patch('/:id/status', creditController.updateCreditStatus);

module.exports = router;