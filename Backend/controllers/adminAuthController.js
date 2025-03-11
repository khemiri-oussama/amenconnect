// controllers/adminAuthController.js

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Session = require("../models/Session");
const crypto = require("crypto");

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

    // --- Create a new session record for the admin ---
    const sessionId = crypto.randomBytes(16).toString('hex');
    const newSession = new Session({
      userId: admin._id, // or use adminId if you prefer a separate field
      sessionId,
      device: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    await newSession.save();
    // --------------------------------------------------

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
// Generate registration email HTML for admin
const generateAdminRegistrationEmailHTML = (name, email, password) => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur l'Admin Panel</title>
      <style>
        /* Base styles */
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background-color: #f5f7fa; 
          margin: 0; 
          padding: 0; 
          color: #333333;
          line-height: 1.6;
        }
        
        /* Container */
        .container { 
          max-width: 600px; 
          margin: 30px auto; 
          background-color: #ffffff; 
          padding: 0; 
          border-radius: 8px; 
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        /* Header */
        .header-bg {
          background-color: #1e293b;
          padding: 30px 0;
          text-align: center;
        }
        
        .logo {
          width: 120px;
          height: auto;
          margin: 0 auto;
          display: block;
        }
        
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 600;
          margin: 15px 0 0;
          text-align: center;
        }
        
        /* Content */
        .content {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1e293b;
        }
        
        .message {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 30px;
        }
        
        /* Credentials box */
        .credentials-box {
          background-color: #f8fafc;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 4px;
          margin: 25px 0;
        }
        
        .credentials-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .credential-item {
          margin-bottom: 10px;
        }
        
        .credential-label {
          font-weight: 600;
          color: #64748b;
          display: inline-block;
          width: 120px;
        }
        
        .credential-value {
          font-family: monospace;
          background-color: #ffffff;
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
        }
        
        /* CTA Button */
        .cta-container {
          text-align: center;
          margin: 35px 0 25px;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #1e293b;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .cta-button:hover {
          background-color: #334155;
        }
        
        /* Security note */
        .security-note {
          background-color: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 4px;
          margin: 25px 0;
          font-size: 14px;
          color: #92400e;
        }
        
        /* Footer */
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-links {
          margin-top: 10px;
        }
        
        .footer-link {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 10px;
        }
        
        /* Responsive adjustments */
        @media only screen and (max-width: 480px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .header-title {
            font-size: 22px;
          }
          
          .credential-label {
            display: block;
            margin-bottom: 5px;
          }
        }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header-bg">
              <img src="https://www.amenbank.com.tn/img/logo.jpg" alt="Logo" class="logo">
              <h1 class="header-title">Bienvenue sur l'Admin Panel</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
              <div class="greeting">Bonjour ${name},</div>
              
              <div class="message">
                  Votre compte administrateur a été créé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de l'Admin Panel.
              </div>
              
              <!-- Credentials Box -->
              <div class="credentials-box">
                  <div class="credentials-title">Vos informations de connexion:</div>
                  
                  <div class="credential-item">
                      <span class="credential-label">Email:</span>
                      <span class="credential-value">${email}</span>
                  </div>
                  
                  <div class="credential-item">
                      <span class="credential-label">Mot de passe:</span>
                      <span class="credential-value">${password}</span>
                  </div>
              </div>
              
              <!-- CTA Button -->
              <div class="cta-container">
                  <a href="https://localhost:8200/admin/login" class="cta-button">Se connecter maintenant</a>
              </div>
              
              <!-- Security Note -->
              <div class="security-note">
                  <strong>Important:</strong> Pour des raisons de sécurité, veuillez changer votre mot de passe après votre première connexion.
              </div>
              
              <div class="message">
                  Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe de support.
                  <br><br>
                  Cordialement,<br>
                  L'équipe Admin
              </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
              <div>© 2025 Admin Panel. Tous droits réservés.</div>
              <div class="footer-links">
                  <a href="#" class="footer-link">Aide</a>
                  <a href="#" class="footer-link">Confidentialité</a>
                  <a href="#" class="footer-link">Conditions d'utilisation</a>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
};

// Function to send the registration email
const sendAdminRegistrationEmail = async (email, name, password) => {
  const mailOptions = {
    from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Bienvenue sur l'Admin Panel",
    html: generateAdminRegistrationEmailHTML(name, email, password),
  };

  return transporter.sendMail(mailOptions);
};


// In controllers/adminAuthController.js
exports.register = async (req, res) => {
  const { name, cin, email, password, role, department, permissions } = req.body;
  try {
    // Create a new admin with the provided fields
    const newAdmin = new Admin({ name, cin, email, password, role, department, permissions });
    await newAdmin.save();

    // Send registration email with the plain-text password
    try {
      await sendAdminRegistrationEmail(email, name, password);
    } catch (emailError) {
      console.error("Error sending registration email:", emailError);
      // Optionally, you might decide to inform the client or simply log the error.
    }

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
