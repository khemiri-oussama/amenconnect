const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Setup Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Send OTP Email
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

// Send OTP Route
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP Route
exports.verifyOTP = async (req, res) => {
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
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};
