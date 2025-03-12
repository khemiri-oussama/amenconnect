// routes/accountCreationRoutes.js
const express = require('express');
const router = express.Router();
const accountCreationController = require('../controllers/accountCreationController');

// POST endpoint to handle account creation requests
router.post('/account-creation', accountCreationController.createAccountCreation);

module.exports = router;
