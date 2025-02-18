// routes/forgotPasswordRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const { forgotPassword, resetPassword } = require("../controllers/forgotPasswordController");
const router = express.Router();

// Forgot password route
router.post(
  "/forgot-password",
  [body("cin").isLength({ min: 8, max: 8 }).withMessage("CIN must be 8 digits.")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    forgotPassword(req, res);
  }
);

// Reset password route
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token is required."),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    resetPassword(req, res);
  }
);

module.exports = router;