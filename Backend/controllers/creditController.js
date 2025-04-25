// File: controllers/creditController.js
const Credit = require('../models/Credit');

/**
 * Enregistre une nouvelle demande de crédit en base MongoDB
 */
exports.demandeCredit = async (req, res) => {
  try {
    const { type, montant, duree, user } = req.body;
    if (!type || !montant || !duree || !user || !user.id) {
      return res.status(400).json({ error: "Type, montant, durée et user.id sont requis." });
    }

    // Création et sauvegarde de la demande
    const creditRequest = await Credit.create({
      userId: user.id,
      type,
      montant: parseFloat(montant),
      duree: parseInt(duree, 10)
    });

    res.status(201).json({
      message: `Demande de crédit enregistrée (ID: ${creditRequest._id}). Retour sous 5 jours ouvrés.`,
      status: creditRequest.status,
      creditId: creditRequest._id
    });
  } catch (error) {
    console.error("Erreur dans demandeCredit :", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la demande de crédit." });
  }
};