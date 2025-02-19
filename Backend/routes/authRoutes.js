const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { register, verifyOTP, resendOTP, logout } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail } = require('../controllers/authController');

const router = express.Router();

// Rate limiters and request validator
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts from this IP, please try again later.'
});

const verifyOTPLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many OTP verification attempts, please try again later.'
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration route (unchanged)
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

// Login route using Passport Local Strategy
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validateRequest,
  (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({ message: info.message || 'Invalid credentials.' });
      }

      // Generate OTP upon successful authentication
      const otpPlain = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      try {
        const otpHashed = await bcrypt.hash(otpPlain, 10);
        user.otp = otpHashed;
        user.otpExpires = otpExpires;
        await user.save();

        try {
          await sendOTPEmail(user.email, otpPlain);
        } catch (emailError) {
          console.error("Error sending OTP email:", emailError);
          return res.status(500).json({ message: "Error sending OTP email. Please try again later." });
        }

        return res.json({
          message: "OTP sent successfully to your email! Please enter it to verify."
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  }
);

// Verify OTP route (unchanged)
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

// Resend OTP route (unchanged)
router.post(
  '/resend-otp',
  verifyOTPLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.')
  ],
  validateRequest,
  resendOTP
);

// Protected endpoint: get user profile using Passport JWT Strategy
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        nom: req.user.nom,
        prénom: req.user.prénom,
      },
    });
  }
);

// Logout route (protected)
router.post("/logout", passport.authenticate('jwt', { session: false }), logout);

module.exports = router;
