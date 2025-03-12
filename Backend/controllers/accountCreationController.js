// controllers/accountCreationController.js
const DemandeCreationCompte = require('../models/DemandeCreationCompte');

exports.createAccountCreation = async (req, res) => {
  try {
    // req.body should contain your form fields.
    // If you use a file upload middleware (e.g., multer), you can map file fields accordingly.
    const demandeData = req.body;

    // Example: if files are handled separately, you could assign file paths
    // if (req.files) {
    //   if (req.files.cinRecto) {
    //     demandeData.cinRecto = req.files.cinRecto[0].path;
    //   }
    //   // Do similar mapping for other file fields...
    // }

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
