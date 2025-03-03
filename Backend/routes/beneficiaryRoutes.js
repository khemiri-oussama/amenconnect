// routes/beneficiaryRoutes.js
const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const verifyToken = require('../middleware/auth');

// Create a new beneficiary
router.post('/', verifyToken, beneficiaryController.addBeneficiary);

// Get all beneficiaries for the authenticated user
router.get('/', verifyToken, beneficiaryController.getBeneficiaries);

module.exports = router;
