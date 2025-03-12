// controllers/accountCreationController.js
const DemandeCreationCompte = require('../models/DemandeCreationCompte');

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

// New controller function to retrieve all demandes
exports.getAllDemandes = async (req, res) => {
  try {
    const demandes = await DemandeCreationCompte.find();
    res.status(200).json({ demandes });
  } catch (error) {
    console.error('Error retrieving demandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
};
