const express = require("express");
const { detectIP } = require("../controllers/IpConttroller");

const router = express.Router();

// Middleware to detect IP for all routes in this file
router.use(detectIP);

// IP info route
router.get("/info", (req, res) => {
  res.json({ message: "IP service running!", clientIP: req.clientIP });
});



module.exports = router;
