const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const { register, verifyOTP, resendOTP, logout } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { generateOTP, sendOTPEmail } = require('../controllers/authController');
const authController = require("../controllers/authController");
const router = express.Router();
const User = require('../models/User');
const Compte = require('../models/Compte');
const Carte = require('../models/Cartes');

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

// Updated Registration route
router.post(
  '/register',
  [
    body('cin').notEmpty().withMessage('CIN is required.'),
    body('nom').notEmpty().withMessage('Nom is required.'),
    body('prenom').notEmpty().withMessage('Prenom is required.'), // updated field name
    body('email').isEmail().withMessage('Valid email is required.'),
    body('telephone').notEmpty().withMessage('Telephone is required.'), // updated field name
    body('employeur').notEmpty().withMessage('Employeur is required.'),
    body('adresseEmployeur').notEmpty().withMessage('Adresse de l’employeur is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
  ],
  validateRequest,
  async (req, res, next) => {
    // Call the register controller and then include all user data in the response.
    try {
      // The register controller now returns the full user object without sensitive fields.
      await register(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Login route using Passport Local Strategy with OTP generation
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
        // Store OTP as an object with hash and expires properties
        user.otp = { hash: otpHashed, expires: otpExpires };
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

// Verify OTP route
router.post(
  '/verify-otp',
  verifyOTPLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('otp').notEmpty().withMessage('OTP is required.')
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      // Call verifyOTP controller which now returns the full user data
      await verifyOTP(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Resend OTP route remains unchanged
router.post(
  '/resend-otp',
  verifyOTPLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.')
  ],
  validateRequest,
  resendOTP
);

// Protected endpoint: get full user profile using Passport JWT Strategy
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Get the user ID from the authenticated token
      const userId = req.user._id;

      // Retrieve full user document
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Fetch all comptes associated with the user
      const comptes = await Compte.find({ userId: userId });

      // Fetch all cartes associated with the user's comptes
      const cartes = await Carte.find({ comptesId: { $in: comptes.map(c => c._id) } });

      // Prepare a safe user object by removing sensitive fields
      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.otp;
      delete safeUser.resetPasswordToken;

      // Send the complete profile data as response
      res.json({
        user: safeUser,
        comptes: comptes,
        cartes: cartes
      });
    } catch (err) {
      console.error("Error fetching profile data:", err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

// Logout route (protected)
router.post("/logout", passport.authenticate('jwt', { session: false }), logout);

// Route for adding a new compte
router.post("/addCompte", authController.addCompte);
router.get("/user/:userId", authController.getUserData);
module.exports = router;
