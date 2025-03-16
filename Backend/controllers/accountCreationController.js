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
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Compte Activé</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
        h2 { color: #333; }
        p { color: #555; }
        .credentials { background-color: #eee; padding: 10px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Votre compte a été activé !</h2>
        <p>Bonjour,</p>
        <p>Nous avons le plaisir de vous informer que votre demande de création de compte a été approuvée.</p>
        <p>Voici vos informations de connexion :</p>
        <div class="credentials">
          <p><strong>Email :</strong> ${userEmail}</p>
          <p><strong>Mot de passe :</strong> ${generatedPassword}</p>
        </div>
        <p>Nous vous recommandons de modifier votre mot de passe dès votre première connexion pour garantir la sécurité de votre compte.</p>
        <p>Cordialement,<br>L'équipe AmenBank</p>
      </div>
    </body>
    </html>
  `;
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
