const express = require("express");
const { body, validationResult } = require("express-validator");
const { forgotPassword, resetPassword } = require("../controllers/forgotPasswordController");
const router = express.Router();

// Forgot password route that accepts either CIN or email
router.post(
  "/forgot-password",
  [
    // Both fields are optional—but if provided, they must be valid.
    body("cin")
      .optional()
      .isLength({ min: 8, max: 8 })
      .withMessage("CIN must be 8 digits."),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Veuillez fournir une adresse email valide."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Ensure that at least one field is provided
    if (!req.body.cin && !req.body.email) {
      return res.status(400).json({ message: "Veuillez fournir un CIN ou une adresse email." });
    }
    forgotPassword(req, res);
  }
);

// Reset password route remains unchanged
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
