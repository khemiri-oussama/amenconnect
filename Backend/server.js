const express = require('express');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/Users');
const app = require('./app');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ OTP email sent successfully!");
    } catch (error) {
      console.error("❌ Failed to send OTP email:", error);
    }
  };
  

  app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // Expires in 5 min
    await user.save();
  
    // Send the OTP via email
    await sendOTPEmail(email, otp);
  
    res.json({ message: "OTP sent successfully!" });
  });
  
  

// 🔹 API Route to Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is correct → Clear OTP from the database
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully!" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Use HTTP for local dev (comment this block for HTTPS)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Start Server with HTTPS (Uncomment if needed)
// const options = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert'),
// };
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`🚀 Secure Server running on https://localhost:${PORT}`);
// });
