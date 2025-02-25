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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - cin
 *         - nom
 *         - prenom
 *         - email
 *         - telephone
 *         - employeur
 *         - adresseEmployeur
 *         - password
 *       properties:
 *         cin:
 *           type: string
 *           description: User's CIN number.
 *           example: "12345678"
 *         nom:
 *           type: string
 *           description: User's last name.
 *           example: "Doe"
 *         prenom:
 *           type: string
 *           description: User's first name.
 *           example: "John"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "john.doe@example.com"
 *         telephone:
 *           type: string
 *           description: User's phone number.
 *           example: "+21612345678"
 *         employeur:
 *           type: string
 *           description: User's employer.
 *           example: "Tech Company Ltd"
 *         adresseEmployeur:
 *           type: string
 *           description: Employer's address.
 *           example: "123 Business Street, 1000"
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters).
 *           example: "securePassword123"
 *     UserProfile:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             cin:
 *               type: string
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *             email:
 *               type: string
 *             telephone:
 *               type: string
 *             employeur:
 *               type: string
 *             adresseEmployeur:
 *               type: string
 *         comptes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Compte'
 *         cartes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Carte'
 *     Compte:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         numeroCompte:
 *           type: string
 *           description: The unique 11-character account number.
 *         solde:
 *           type: number
 *         type:
 *           type: string
 *           enum: [Compte courant, Compte épargne]
 *         RIB:
 *           type: string
 *           description: The complete RIB (bank code + branch code + account number + RIB key).
 *         domiciliation:
 *           type: string
 *           description: Bank domiciliation details (name of bank and agency).
 *         IBAN:
 *           type: string
 *           description: The account's IBAN.
 *         historique:
 *           type: array
 *           items:
 *             type: object
 *           description: History of account operations.
 *     Carte:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         CardNumber:
 *           type: string
 *           description: The unique 16-digit card number.
 *         ExpiryDate:
 *           type: string
 *           description: The expiry date in MM/YY format.
 *         CardHolder:
 *           type: string
 *         CreatedAt:
 *           type: string
 *         UpdatedAt:
 *           type: string
 *         comptesId:
 *           type: string
 *           description: The ID of the compte this card is linked to.
 *         TypeCarte:
 *           type: string
 *           description: The type of the card (e.g., debit, credit).
 *         creditCardTransactions:
 *           type: array
 *           items:
 *             type: object
 *         monthlyExpenses:
 *           type: object
 *           properties:
 *             current:
 *               type: number
 *             limit:
 *               type: number
 *         atmWithdrawal:
 *           type: object
 *           properties:
 *             current:
 *               type: number
 *             limit:
 *               type: number
 *         pendingTransactions:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             count:
 *               type: number
 *         cardStatus:
 *           type: string
 *           description: The current status of the card.
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication information is missing or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized access"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             cin: "12345678"
 *             nom: "Doe"
 *             prenom: "John"
 *             email: "john.doe@example.com"
 *             telephone: "+21612345678"
 *             employeur: "Tech Company Ltd"
 *             adresseEmployeur: "123 Business Street, 1000"
 *             password: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     cin:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input data.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and receive an OTP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: "john.doe@example.com"
 *             password: "securePassword123"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully to your email! Please enter it to verify."
 *       400:
 *         description: Invalid credentials.
 *       429:
 *         description: Too many login attempts.
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete login.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *           example:
 *             email: "john.doe@example.com"
 *             otp: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid or expired OTP.
 *       429:
 *         description: Too many OTP verification attempts.
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Retrieve user profile including comptes and cartes.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/addCompte:
 *   post:
 *     summary: Add a new compte for a user.
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "60f1c1bde9f1b2a5a8f2c123"
 *               type:
 *                 type: string
 *                 description: The type of compte.
 *                 enum: [Compte courant, Compte épargne]
 *                 example: "Compte courant"
 *     responses:
 *       201:
 *         description: Compte added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compte added successfully."
 *                 compte:
 *                   $ref: '#/components/schemas/Compte'
 *       400:
 *         description: Invalid input or compte type already exists for the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/user/{userId}:
 *   get:
 *     summary: Retrieve user data along with comptes and cartes.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

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
