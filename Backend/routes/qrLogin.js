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
    const session = await QRSession.findOneAndUpdate(
      { sessionId },
      { $setOnInsert: { sessionId, status: "pending", createdAt: new Date() } },
      { upsert: true, new: true }
    );
    return res.json({ message: "Session created", sessionId: session.sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
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
// routes/qrLogin.js
const Session = require("../models/Session"); // Import the Session model

router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const sessionQR = await QRSession.findOne({ sessionId });
    if (!sessionQR) return res.status(404).json({ message: "Session not found" });

    if (sessionQR.status === "authenticated" && sessionQR.user) {
      // Create or update the corresponding session in the Session collection
      await Session.findOneAndUpdate(
        { sessionId: sessionQR.sessionId },
        { user: sessionQR.user, status: sessionQR.status, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      // Generate a new token for the kiosk
      const token = jwt.sign({ id: sessionQR.user, sessionId: sessionQR.sessionId }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.json({ status: sessionQR.status, user: sessionQR.user, token });
    }
    return res.json({ status: sessionQR.status, user: sessionQR.user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
