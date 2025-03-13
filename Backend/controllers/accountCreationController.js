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
    const demande = await DemandeCreationCompte.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }
    res.status(200).json({ message: 'Demande approuvée avec succès', demande });
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
