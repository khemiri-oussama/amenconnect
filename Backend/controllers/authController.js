const User = require("../models/User");
const Compte = require("../models/Compte"); // Import the Compte model
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // For production, consider using OAuth2 or another secure option
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

// Helper: generate a unique account number
const generateAccountNumber = () => {
  // This is a simple example – in production, ensure that generated numbers are unique
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

// Available compte types with default values
const compteTypes = {
  "Compte courant": {
    avecChéquier: true,
    avecCarteBancaire: true,
    modalitésRetrait: "Limite de retrait: 1000 TND/jour",
    conditionsGel: "Aucune restriction"
  },
  "Compte épargne": {
    avecChéquier: false,
    avecCarteBancaire: false,
    modalitésRetrait: "Retrait limité à 2 fois par mois",
    conditionsGel: "Fonds bloqués pour 1 an"
  }
};

// **Register New User and Create Accounts**
exports.register = async (req, res) => {
  // Note: expecting "prenom" and "telephone" now instead of "prénom" and "téléphone"
  const { cin, nom, prenom, email, telephone, employeur, adresseEmployeur, password, comptes = ["Compte courant", "Compte épargne"] } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create and save the new user
    user = new User({ cin, nom, prenom, email, telephone, employeur, adresseEmployeur, password });
    await user.save();
    console.log("User saved:", user);

    // Create the comptes based on user selection
    const compteDocuments = comptes.map(type => ({
      userId: user._id, // Link to user
      numéroCompte: generateAccountNumber(),
      solde: 0.0,
      type,
      ...compteTypes[type], // Merge default values
      historique: []
    }));

    await Compte.insertMany(compteDocuments);
    console.log("Comptes created:", compteDocuments);

    res.status(201).json({ message: "User registered and comptes created successfully." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addCompte = async (req, res) => {
  const { userId, type } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!compteTypes[type]) {
      return res.status(400).json({ message: "Invalid compte type." });
    }

    // Check if the user already has this compte type
    const existingCompte = await Compte.findOne({ userId, type });
    if (existingCompte) {
      return res.status(400).json({ message: "User already has this type of compte." });
    }

    // Create new compte with a unique `_id` (automatically generated)
    const newCompte = new Compte({
      userId,
      numéroCompte: generateAccountNumber(),
      solde: 0.0,
      type,
      ...compteTypes[type], // Merge default values
      historique: []
    });

    await newCompte.save();
    res.status(201).json({ message: "Compte added successfully.", compte: newCompte });
  } catch (err) {
    console.error("Add compte error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Login route (if using Passport's local strategy, this may be handled elsewhere)
exports.login = async (req, res) => {
  res.status(200).json({ message: "Login route" });
};

// OTP Verification endpoint
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otp.expires || new Date() > user.otp.expires) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Compare provided OTP with stored OTP hash
    const isOTPMatch = await bcrypt.compare(otp, user.otp.hash);
    if (!isOTPMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Generate a JWT token valid for 1 hour
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Clear OTP data from the user document
    user.otp = { hash: null, expires: null };
    await user.save();

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.json({
      message: "OTP verified successfully!",
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Resend OTP endpoint
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    const otpPlain = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const otpHashed = await bcrypt.hash(otpPlain, 10);

    // Store OTP as an object with hash and expires properties
    user.otp = { hash: otpHashed, expires: otpExpires };
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

// Logout endpoint
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

const Carte = require("../models/Cartes"); // Import the Carte model

exports.getUserData = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Fetch the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch all comptes associated with the user
    const comptes = await Compte.find({ userId: user._id });
    console.log("User ID:", user._id);
    console.log("Comptes found:", comptes);
    console.log("Comptes IDs:", comptes.map(c => c._id));
    

    
    
    
    // Fetch all cartes associated with the user's comptes
    const cartes = await Carte.find({ comptesId: { $in: comptes.map(c => c._id) } });
console.log("Cartes found:", cartes);
    // Combine the data into a single response
    const userData = {
      user: {
        cin: user.cin,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        employeur: user.employeur,
        adresseEmployeur: user.adresseEmployeur,
      },
      comptes: comptes.map(compte => ({
        numéroCompte: compte.numéroCompte,
        solde: compte.solde,
        type: compte.type,
        avecChéquier: compte.avecChéquier,
        avecCarteBancaire: compte.avecCarteBancaire,
        modalitésRetrait: compte.modalitésRetrait,
        conditionsGel: compte.conditionsGel,
      })),
      cartes: cartes.map(carte => ({
        CardNumber: carte.CardNumber,
        ExpiryDate: carte.ExpiryDate,
        CardHolder: carte.CardHolder,
      })),
    };

    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Export OTP helper functions if needed elsewhere
exports.generateOTP = generateOTP;
exports.sendOTPEmail = sendOTPEmail;
