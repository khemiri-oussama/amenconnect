// controllers/accountCreationController.js

const DemandeCreationCompte = require('../models/DemandeCreationCompte');
const User = require("../models/User");
const Compte = require("../models/Compte");
const Carte = require("../models/Cartes");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { generateRIB, DOMICILIATION, generateOTP } = require("../config/helper"); // adjust if needed

// Helper: generate a random password (adjust complexity as required)
const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString('hex'); // generates a 12-character hex string
};

// Helper: generate a unique account number (ensuring uniqueness as needed)
const generateAccountNumber = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};
// Configure nodemailer transporter (adjust service and auth as needed)
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., "gmail"
  auth: {
    user: process.env.EMAIL_USER, // set in your environment variables
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: generate the email HTML content in French
const generateAccountApprovedEmailHTML = (userEmail, generatedPassword) => {
  return`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue - Votre Compte est Approuvé</title>
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo img { width: 150px; height: auto; }
    .header { text-align: center; font-size: 28px; font-weight: bold; color: #121660; margin-bottom: 30px; }
    .welcome-message { text-align: center; font-size: 18px; color: #333; margin-bottom: 30px; line-height: 1.6; }
    .info-container { background-color: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
    .info-label { font-size: 16px; color: #666; margin-bottom: 5px; }
    .info-value { font-size: 18px; color: #121660; font-weight: bold; margin-bottom: 20px; word-break: break-all; }
    .password-container { background-color: #edf7ed; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #47CE65; }
    .password-value { font-size: 24px; color: #47CE65; text-align: center; letter-spacing: 3px; font-weight: bold; font-family: monospace; }
    .notice { background-color: #fff8e6; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #ffb74d; }
    .notice-text { font-size: 16px; color: #e65100; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background-color: #121660; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
    .footer { text-align: center; font-size: 14px; color: #47B3CE; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(71, 179, 206, 0.3); }
    .divider { height: 1px; background-color: #eee; margin: 25px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="/amen_logo.png" alt="AmenBank">
    </div>
    <div class="header">
      Félicitations! Votre Compte est Approuvé
    </div>
    <div class="welcome-message">
      <p>Nous sommes ravis de vous informer que votre demande de compte a été approuvée. Bienvenue dans notre communauté!</p>
    </div>
    
    <div class="info-container">
      <div class="info-label">Votre identifiant de connexion:</div>
      <div class="info-value">${userEmail}</div>
      
      <div class="divider"></div>
      
      <div class="info-label">Votre mot de passe temporaire:</div>
      <div class="password-container">
        <div class="password-value">${generatedPassword}</div>
      </div>
    </div>
    
    <div class="notice">
      <div class="notice-text">
        <strong>Important:</strong> Pour des raisons de sécurité, vous devrez changer ce mot de passe lors de votre première connexion.
      </div>
    </div>
    
    <div class="button-container">
      <a href="https://localhost:8200" class="button">Se Connecter Maintenant</a>
    </div>
    
    <div class="welcome-message">
      <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter notre équipe de support.</p>
    </div>
    
    <div class="footer">
      <p>Ce message est automatique, merci de ne pas y répondre directement.</p>
      <p>&copy; 2025 AmenBank. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`;
};

exports.createAccountCreation = async (req, res) => {
  try {
    const demandeData = req.body;
    const demande = new DemandeCreationCompte(demandeData);
    await demande.save();
    res.status(201).json({ 
      message: 'Demande de création de compte enregistrée avec succès',
      demande 
    });
  } catch (error) {
    console.error('Error creating demande:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la demande' });
  }
};

exports.getAllDemandes = async (req, res) => {
  try {
    const demandes = await DemandeCreationCompte.find();
    res.status(200).json({ demandes });
  } catch (error) {
    console.error('Error retrieving demandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
};

// New controller function to approve a demande
exports.approveAccountCreation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update the demande to approved
    const demande = await DemandeCreationCompte.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    // Create a new user using data from the demande
    const generatedPassword = generateRandomPassword();
    const newUserData = {
      cin: demande.numeroCIN,
      nom: demande.nom,
      prenom: demande.prenom,
      email: demande.email,
      telephone: demande.numeroGSM,
      employeur: demande.fonction || "N/A", // use an appropriate field or default
      adresseEmployeur: demande.adresseDomicile,
      password: generatedPassword,
    };

    // Check if a user with the email already exists
    let existingUser = await User.findOne({ email: demande.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }

    const newUser = new User(newUserData);
    await newUser.save();

    // Create the compte for the new user
    const accountNumber = generateAccountNumber();
    const rib = generateRIB(accountNumber);
    const compteData = {
      userId: newUser._id,
      numéroCompte: accountNumber,
      solde: 0.0,
      type: demande.typeCompte || "Compte courant", // or map demande.typeCompte to your compte types
      RIB: rib,
      domiciliation: DOMICILIATION,
      historique: []
    };

    const newCompte = new Compte(compteData);
    await newCompte.save();

    // Optionally create a credit card if the demande indicates so.
    // We assume there's a boolean field 'wantCreditCard' in the demande.
    let newCard;
    if (demande.wantCreditCard) {
      newCard = new Carte({
        CardNumber: crypto.randomBytes(8).toString('hex').toUpperCase(), // Example card number
        CardHolder: `${newUser.prenom} ${newUser.nom}`,
        comptesId: newCompte._id,
        TypeCarte: "Credit", // or as specified
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      });
      await newCard.save();
    }

    // Send an email to the new user with their credentials
    const mailOptions = {
      from: `"AmenConnect" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: "Activation de votre compte AmenBank",
      html: generateAccountApprovedEmailHTML(newUser.email, generatedPassword),
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Demande approuvée. Utilisateur, compte et carte (si demandée) créés avec succès et email envoyé.',
      user: newUser,
      compte: newCompte,
      card: newCard || null,
    });
  } catch (error) {
    console.error('Error approving demande:', error);
    res.status(500).json({ error: 'Erreur lors de l\'approbation de la demande' });
  }
};

// New controller function to reject a demande
exports.rejectAccountCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const demande = await DemandeCreationCompte.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }
    res.status(200).json({ message: 'Demande rejetée avec succès', demande });
  } catch (error) {
    console.error('Error rejecting demande:', error);
    res.status(500).json({ error: 'Erreur lors du rejet de la demande' });
  }
};
