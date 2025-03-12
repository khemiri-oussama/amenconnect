// routes/accountCreationRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); // require passport to use authentication middleware
const accountCreationController = require('../controllers/accountCreationController');

// POST endpoint to handle account creation requests
router.post('/account-creation', accountCreationController.createAccountCreation);

// GET endpoint to retrieve all demandes (only accessible by admins)
router.get(
  '/account-creation',
  passport.authenticate('admin-jwt', { session: false }),
  accountCreationController.getAllDemandes
);

module.exports = router;
