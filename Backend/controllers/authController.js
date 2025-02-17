const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Configure nodemailer transporter (consider moving this config to a separate module if reused)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another service like SendGrid
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate the HTML content for the OTP email
const generateOTPEmailHTML = (otp) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .otp {
            font-size: 32px;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 8px;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            color: #999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            OTP Verification Code
          </div>
          <div class="otp">
            ${otp}
          </div>
          <p>Use the above OTP code to verify your login.</p>
          <div class="footer">
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"AmenConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: generateOTPEmailHTML(otp),
  };

  return transporter.sendMail(mailOptions);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate OTP and set its expiration (10 minutes from now)
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP and expiration in the user document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email and handle any email sending errors
    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      return res.status(500).json({ message: 'Error sending OTP email. Please try again later.' });
    }

    res.json({
      message: 'OTP sent successfully to your email! Please enter it to verify.',
      user: { id: user._id, email: user.email, nom: user.nom, prénom: user.prénom },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Basic validation
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the provided OTP matches the one in the database
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Generate a JWT token if OTP is valid
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Clear OTP details after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      message: 'OTP verified successfully!',
      token,
      user: { id: user._id, email: user.email, nom: user.nom, prénom: user.prénom },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
