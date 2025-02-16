const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

<<<<<<< HEAD
const app = require("./app");
=======
const User = require('./models/Users');  // Ensure model is named User.js
const app = require('./app');
>>>>>>> 6b6915885903b43716613fec5fb06745a8f570f4

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
=======
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
    throw error;  // Rethrow to be caught in the route
  }
};

app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;
    console.log("Searching for user with email:", email); // Debugging line

    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found"); // Debugging line
        return res.status(404).json({ message: "User not found" });
    }
    
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // Expires in 5 min
    await user.save();

    // Send the OTP via email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
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
>>>>>>> 6b6915885903b43716613fec5fb06745a8f570f4
