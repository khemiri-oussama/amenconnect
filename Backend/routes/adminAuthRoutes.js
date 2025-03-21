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

// New profile endpoint
router.get('/profile', adminAuthMiddleware, adminAuthController.getProfile);
module.exports = router;

router.put('/:id', adminAuthMiddleware, adminAuthController.updateAdmin);

router.post('/reset',adminAuthController.resetPassword);
router.post('/forget',adminAuthController.forgotPassword);