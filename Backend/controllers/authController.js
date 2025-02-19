const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // For production consider using OAuth2 or another dedicated service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP email HTML
const generateOTPEmailHTML = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code de Vérification OTP</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #1E1E1E; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo img { width: 150px; height: auto; }
        .header { text-align: center; font-size: 28px; font-weight: bold; color: #121660; margin-bottom: 30px; }
        .otp-container { background-color: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
        .otp { font-size: 48px; color: #47CE65; text-align: center; letter-spacing: 8px; font-weight: bold; }
        .message { text-align: center; font-size: 18px; color: #1E1E1E; margin-bottom: 30px; line-height: 1.6; }
        .footer { text-align: center; font-size: 14px; color: #47B3CE; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(71, 179, 206, 0.3); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://www.amenbank.com.tn/img/logo.jpg" alt="AmenBank">
        </div>
        <div class="header">
          Vérifiez Votre Connexion
        </div>
        <div class="otp-container">
          <div class="otp">
            ${otp}
          </div>
        </div>
        <div class="message">
          <p>Utilisez le code à usage unique (OTP) ci-dessus pour vérifier votre connexion.</p>
          <p>Ce code expirera dans <strong>10 minutes</strong>.</p>
        </div>
        <div class="footer">
          <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail ou contacter immédiatement notre équipe d'assistance.</p>
          <p>&copy; 2025 AmenBank. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Amen Connect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: generateOTPEmailHTML(otp),
  };

  return transporter.sendMail(mailOptions);
};

exports.register = async (req, res) => {
  const { cin, nom, prénom, email, téléphone, employeur, adresseEmployeur, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email." });
    }
    user = new User({ cin, nom, prénom, email, téléphone, employeur, adresseEmployeur, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  // This route is now handled via Passport's local strategy in routes/authRoutes.js.
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    const isOTPMatch = await bcrypt.compare(otp, user.otp);
    if (!isOTPMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.json({
      message: "OTP verified successfully!",
      user: { id: user._id, email: user.email, nom: user.nom, prénom: user.prénom },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    const otpPlain = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const otpHashed = await bcrypt.hash(otpPlain, 10);

    user.otp = otpHashed;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await sendOTPEmail(user.email, otpPlain);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({ message: "Error sending OTP email. Please try again later." });
    }

    res.json({
      message: "New OTP sent successfully to your email!"
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// Export OTP helper functions for use in routes
exports.generateOTP = generateOTP;
exports.sendOTPEmail = sendOTPEmail;
