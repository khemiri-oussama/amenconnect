const express = require('express');
const { login, register, verifyOTP } = require('../controllers/authController');
const router = express.Router();

// POST route for login
router.post('/login', async (req, res) => {
    try {
        await login(req, res);  // Calling the login controller
    } catch (err) {
        console.error('Login route error:', err);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route for register
router.post('/register', async (req, res) => {
    try {
        await register(req, res);  // Calling the register controller
    } catch (err) {
        console.error('Register route error:', err);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/verify-otp', verifyOTP);

module.exports = router;
