// routes/qrLogin.js
const express = require("express");
const router = express.Router();
const QRSession = require("../models/QRSession");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

// Create a new QR session (used by the kiosk)
router.post("/create", async (req, res) => {
  const { sessionId } = req.body;
  try {
    let session = await QRSession.findOne({ sessionId });
    if (!session) {
      session = new QRSession({ sessionId });
      await session.save();
    }
    return res.json({ message: "Session created", sessionId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST endpoint: Authenticate a QR session using the authenticated mobile user
router.post("/", verifyToken, async (req, res) => {
  const { sessionId } = req.body;
  // req.user is set by the verifyToken middleware from the mobile's token
  const userId = req.user.id;
  try {
    const session = await QRSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = "authenticated";
    session.user = userId;
    await session.save();
    return res.json({ message: "Session authenticated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET endpoint: Check the status of a QR session and issue a token for the kiosk if authenticated
router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await QRSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status === "authenticated" && session.user) {
      // Generate a new token for the kiosk
      const token = jwt.sign({ id: session.user }, process.env.JWT_SECRET, { expiresIn: "1h" });
      // Set a secure, HTTP-only cookie so that the kiosk browser is authenticated
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      return res.json({ status: session.status, user: session.user, token });
    }
    return res.json({ status: session.status, user: session.user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
