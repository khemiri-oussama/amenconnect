const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services like SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email user from .env
        pass: process.env.EMAIL_PASS, // Your email password (or App password) from .env
    },
});

// Function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
const sendOTPEmail = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `
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
        `,
    };

    return transporter.sendMail(mailOptions);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Set OTP expiration time (e.g., 10 minutes from now)
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10);

        // Store OTP and OTP expiration time in the database
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP to the user's email
        await sendOTPEmail(user.email, otp);

        res.json({
            message: 'OTP sent successfully to your email! Please enter it to verify.',
            user: { id: user._id, email: user.email, nom: user.nom, prénom: user.prénom },
        });
    } catch (err) {
        console.error('Login error:', err); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Check if the OTP matches and hasn't expired
      if (user.otp !== otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

      const now = new Date();
      if (now > user.otpExpires) {
          return res.status(400).json({ message: 'OTP has expired' });
      }

      // OTP is valid, generate a JWT token
      const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Clear OTP and OTP expiration time after verification
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
