const express = require("express");
const router = express.Router();
const HistoriqueController = require("../controllers/historiqueController");

// GET /api/historique
router.get("/", HistoriqueController.getHistorique);

module.exports = router;
