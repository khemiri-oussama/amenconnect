// controllers/historiqueController.js
const Compte = require("../models/Compte");

exports.getHistorique = async (req, res) => {
  try {
    // Convert user's compteIds into an array of strings
    const userCompteIds = req.user?.compteIds?.map((id) => id.toString()) || [];

    // Fetch all comptes belonging to the user
    const comptes = await Compte.find({ _id: { $in: userCompteIds } }).lean();

    // Combine historique arrays from all comptes
    let allHistorique = [];
    comptes.forEach((compte) => {
      if (compte.historique && Array.isArray(compte.historique)) {
        allHistorique = allHistorique.concat(compte.historique);
      }
    });

    // Sort transactions descending by date
    allHistorique.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Optional: apply pagination if needed
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const paginatedHistorique = allHistorique.slice(startIndex, startIndex + Number(limit));

    res.json({
      page: Number(page),
      limit: Number(limit),
      total: allHistorique.length,
      transactions: paginatedHistorique,
    });
  } catch (error) {
    console.error("Error fetching historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
