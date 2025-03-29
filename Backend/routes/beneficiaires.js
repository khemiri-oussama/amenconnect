// routes/beneficiaires.js
const express = require("express");
const router = express.Router();
const beneficiairesController = require("../controllers/beneficiairesController");

router.get("/", beneficiairesController.getBeneficiaires);
router.post("/", beneficiairesController.createBeneficiaire);
router.put("/:id", beneficiairesController.updateBeneficiaire);
router.delete("/:id", beneficiairesController.deleteBeneficiaire);

module.exports = router;
