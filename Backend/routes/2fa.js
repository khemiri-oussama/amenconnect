// routes/2fa.js
const express = require("express");
const router = express.Router();
const passport = require("passport");  // Import passport here
const TwoFactorConfig = require("../models/TwoFactorConfig");

// Apply Passport admin-jwt authentication to all routes in this router
router.use(passport.authenticate('admin-jwt', { session: false }));

// GET /api/2fa - Get current user 2FA config
router.get("/", async (req, res) => {
  try {
    const config = await TwoFactorConfig.findOne({ userId: req.user._id });
    if (!config) {
      // Optionally create a default config if none exists
      const newConfig = new TwoFactorConfig({ userId: req.user._id });
      await newConfig.save();
      return res.json(newConfig);
    }
    res.json(config);
  } catch (error) {
    console.error("Error fetching 2FA settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/2fa - Update 2FA settings
router.put("/", async (req, res) => {
  const { is2FAEnabled, smsEnabled, emailEnabled, googleAuthEnabled } = req.body;
  try {
    const config = await TwoFactorConfig.findOneAndUpdate(
      { userId: req.user._id },
      { is2FAEnabled, smsEnabled, emailEnabled, googleAuthEnabled, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ message: "2FA settings updated successfully", config });
  } catch (error) {
    console.error("Error updating 2FA settings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
