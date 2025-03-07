// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Admin login endpoint
router.post('/login', adminAuthController.login);

router.post('/verify-otp', adminAuthController.verifyOTP);

// Protected admin logout endpoint
router.post('/logout', adminAuthMiddleware, adminAuthController.logout);

// Optional: Admin registration endpoint
router.post('/register', adminAuthController.register);

module.exports = router;
