// routes/historiqueRoutes.js
const express = require('express');
const router = express.Router();
const Compte = require('../models/Compte');

// GET /api/historique - returns all transactions for the authenticated user
router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user information available' });
    }
    
    const userId = req.user._id;
    // Find all accounts for the user
    const comptes = await Compte.find({ userId });
    
    // Combine all transactions from all accounts
    let allTransactions = [];
    comptes.forEach(compte => {
      if (Array.isArray(compte.historique)) {
        allTransactions = allTransactions.concat(compte.historique);
      }
    });
    
    res.json(allTransactions);
  } catch (error) {
    console.error("Historique route error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
