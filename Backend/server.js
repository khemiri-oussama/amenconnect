const express = require('express');
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/db');
require('dotenv').config();

const app = require('./app');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Use HTTP for local dev (comment this block for HTTPS)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const sendOTP = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "khemirioussama00@gmail.com" }),
    });
    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// 🔹 API Route to Send OTP
app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    // Send OTP via email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ message: "Failed to send OTP", error: err });

        res.json({ message: "OTP sent successfully!" });
    });
});

// 🔹 API Route to Verify OTP
app.post("/api/verify-otp", async (req, res) => {
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
});

// Start Server
// Uncomment this block if you have SSL certificates
// const options = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert'),
// };
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`🚀 Secure Server running on https://localhost:${PORT}`);
// });
