// controllers/creditController.js
const Credit = require('../models/Credit');
const Compte = require('../models/Compte');

// Get all credits (admin)
exports.getAllCredits = async (req, res) => {
  try {
    const credits = await Credit.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'prenom nom email')
      .populate('compteId', 'numéroCompte type');

    res.status(200).json(credits);
  } catch (error) {
    console.error("Erreur dans getAllCredits :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des crédits." });
  }
};

// Get credits for a specific user
exports.getUserCredits = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID est requis." });
    }

    const credits = await Credit.find({ userId })
      .sort({ createdAt: -1 })
      .populate('compteId', 'numéroCompte type');

    res.status(200).json(credits);
  } catch (error) {
    console.error("Erreur dans getUserCredits :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des crédits." });
  }
};

// Get a credit by its ID
exports.getCreditById = async (req, res) => {
  try {
    const { id } = req.params;
    const credit = await Credit.findById(id)
      .populate('userId', 'prenom nom email')
      .populate('compteId', 'numéroCompte type');

    if (!credit) {
      return res.status(404).json({ error: "Crédit non trouvé." });
    }

    res.status(200).json(credit);
  } catch (error) {
    console.error("Erreur dans getCreditById :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du crédit." });
  }
};

// Create a new credit request
exports.demandeCredit = async (req, res) => {
  try {
    const { type, montant, duree, user, compteId, RevenuMensuel } = req.body;
    if (!type || !montant || !duree || !user?.id || !compteId || !RevenuMensuel) {
      return res.status(400).json({ error: "Type, montant, durée, RevenuMensuel, user ID et compte ID sont requis." });
    }

    const compteExists = await Compte.findById(compteId);
    if (!compteExists) {
      return res.status(404).json({ error: "Compte bancaire introuvable." });
    }

    let tauxInteret;
    switch (type) {
      case 'Auto': tauxInteret = 5.0; break;
      case 'Immobilier': tauxInteret = 3.5; break;
      case 'Études': tauxInteret = 4.0; break;
      case 'Liquidité': tauxInteret = 6.0; break;
      default: tauxInteret = 5.0;
    }

    const dateDebut = new Date();
    const dateFin = new Date(dateDebut);
    dateFin.setMonth(dateFin.getMonth() + parseInt(duree));

    const principal = parseFloat(montant);
    const n = parseInt(duree);
    const monthlyRate = tauxInteret / 100 / 12;
    const mensualite = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

    const creditRequest = await Credit.create({
      userId: user.id,
      compteId,
      type,
      montant: principal,
      duree: n,
      tauxInteret,
      mensualite: Number(mensualite.toFixed(2)),
      dateDebut,
      dateFin,
      RevenuMensuel
    });

    res.status(201).json({
      message: `Demande de crédit enregistrée (ID: ${creditRequest._id})`,
      credit: creditRequest
    });
  } catch (error) {
    console.error("Erreur dans demandeCredit :", error);
    res.status(500).json({ error: error.message || "Erreur lors de la demande de crédit." });
  }
};

exports.updateCreditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow these statuses
    const allowed = ['approved', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Status invalide. Doit être 'approved' ou 'rejected'." });
    }

    const credit = await Credit.findById(id);
    if (!credit) {
      return res.status(404).json({ error: "Crédit non trouvé." });
    }

    credit.status = status;
    await credit.save();

    res.status(200).json({
      message: `Statut du crédit mis à jour en '${status}'.`,
      credit
    });
  } catch (error) {
    console.error("Erreur dans updateCreditStatus :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du statut." });
  }
};