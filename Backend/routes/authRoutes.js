//routes/authRoutes.js
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
const LoginAttempt = require('../models/LoginAttempt');
const Alert = require('../models/AdminAlert');
const getIPInfo = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/ip/info");
    if (!response.ok) {
      console.error("Failed to fetch IP info");
      return null;
    }
    const data = await response.json();
    return data.clientIP; // Adjust according to your API's JSON structure
  } catch (err) {
    console.error("Error fetching IP info:", err);
    return null;
  }
};

// Rate limiters and request validator
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts from this IP, please try again later.',
  handler: async (req, res, next) => {
    const { email } = req.body;
    const ipAddress = (await getIPInfo()) || "unknown";;
    const userAgent = req.get('User-Agent');

    // Log the failed login attempt
    await LoginAttempt.create({ email, ipAddress, userAgent, success: false });

    // Create an alert record
    await Alert.create({
      message: `Tentative de connexion suspecte détectée pour l'email ${email} depuis ${ipAddress}.`
    });

    // Respond with the rate limit message
    res.status(429).json({ message: 'Too many login attempts from this IP, please try again later.' });
  }
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

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validateRequest,
  (req, res, next) => {
    const { email } = req.body;
    // No need to get ipAddress and userAgent here since logging happens in the handler
    
    passport.authenticate('local', async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // Directly send the error response without logging here
        return res.status(400).json({ message: info.message || 'Invalid credentials.' });
      }
      
      // For successful login, proceed with OTP generation etc.
      const otpPlain = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      try {
        const otpHashed = await bcrypt.hash(otpPlain, 10);
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
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const comptes = await Compte.find({ userId: userId });
      const cartes = await Carte.find({ comptesId: { $in: comptes.map(c => c._id) } }); // No populate needed

      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.otp;
      delete safeUser.resetPasswordToken;

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

module.exports = router;
