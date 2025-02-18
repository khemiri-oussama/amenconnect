// routes/authRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { login, register, verifyOTP, resendOTP, logout } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts from this IP, please try again later.'
});

const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many OTP verification attempts, please try again later.'
});

// Validation error handler middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register route validations
router.post(
  '/register',
  [
    body('cin').notEmpty().withMessage('CIN is required.'),
    body('nom').notEmpty().withMessage('Nom is required.'),
    body('prénom').notEmpty().withMessage('Prénom is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('téléphone').notEmpty().withMessage('Téléphone is required.'),
    body('employeur').notEmpty().withMessage('Employeur is required.'),
    body('adresseEmployeur').notEmpty().withMessage('Adresse de l’employeur is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
  ],
  validateRequest,
  register
);

// Login route validations
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validateRequest,
  login
);

// Verify OTP route validations
router.post(
  '/verify-otp',
  verifyOTPLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('otp').notEmpty().withMessage('OTP is required.')
  ],
  validateRequest,
  verifyOTP
);

// Resend OTP route validations
router.post(
  '/resend-otp',
  verifyOTPLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.')
  ],
  validateRequest,
  resendOTP
);


// Protected endpoint: get user profile from token
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      // Include other user details as needed
    },
  });
});
router.post("/logout", verifyToken, logout);
module.exports = router;
