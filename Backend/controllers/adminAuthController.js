// controllers/adminAuthController.js

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // For production, consider a more secure option
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP email HTML for admin
const generateAdminOTPEmailHTML = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Code de Vérification OTP - Admin</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
      .header { text-align: center; font-size: 24px; margin-bottom: 20px; color: #333; }
      .otp { font-size: 36px; font-weight: bold; color: #47CE65; text-align: center; letter-spacing: 8px; }
      .message { text-align: center; margin-top: 20px; font-size: 16px; color: #555; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Vérification de Connexion Admin</div>
      <div class="otp">${otp}</div>
      <div class="message">
        Utilisez ce code OTP pour compléter votre connexion. Ce code expirera dans <strong>10 minutes</strong>.
      </div>
    </div>
  </body>
  </html>
  `;
};

// Function to send OTP email to admin
const sendAdminOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Votre code OTP d'administration",
    html: generateAdminOTPEmailHTML(otp),
  };

  return transporter.sendMail(mailOptions);
};

// LOGIN ENDPOINT: Validate credentials, generate & send OTP
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate OTP and hash it
    const otpPlain = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const otpHashed = await bcrypt.hash(otpPlain, 10);

    // Store OTP in the admin document (ensure your Admin model includes an 'otp' field)
    admin.otp = { hash: otpHashed, expires: otpExpires };
    await admin.save();

    // Send OTP email
    try {
      await sendAdminOTPEmail(admin.email, otpPlain);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({ message: "Error sending OTP email. Please try again later." });
    }

    res.json({ message: "OTP sent to your email for admin verification." });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// OTP VERIFICATION ENDPOINT: Verify the OTP and generate JWT token
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    // Check if OTP exists and is still valid
    if (!admin.otp || !admin.otp.expires || new Date() > admin.otp.expires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Compare provided OTP with stored hashed OTP
    const isOTPMatch = await bcrypt.compare(otp, admin.otp.hash);
    if (!isOTPMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is verified: generate JWT token valid for 1 hour
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Clear OTP data from admin document
    admin.otp = { hash: null, expires: null };
    await admin.save();

    // Set the token as an HTTP-only cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.json({ message: "OTP verified successfully. Admin logged in." });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// RESEND OTP ENDPOINT: Generate and send a new OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    const otpPlain = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const otpHashed = await bcrypt.hash(otpPlain, 10);

    // Update the OTP in the admin document
    admin.otp = { hash: otpHashed, expires: otpExpires };
    await admin.save();

    try {
      await sendAdminOTPEmail(admin.email, otpPlain);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({ message: "Error sending OTP email. Please try again later." });
    }

    res.json({ message: "New OTP sent successfully to your email!" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// LOGOUT ENDPOINT (optional)
exports.logout = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: "Admin logged out successfully." });
  } catch (err) {
    console.error("Admin logout error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // req.admin is set by the adminAuthMiddleware from the JWT token
    const admin = await Admin.findById(req.admin.id).select('-password -otp');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.json({ admin });
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// In controllers/adminAuthController.js
exports.register = async (req, res) => {
  const { name, cin, email, phone, dateDeNaissance, password } = req.body;
  try {
    // Create a new admin (add validations as needed)
    const newAdmin = new Admin({ name, cin, email, phone, dateDeNaissance, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

