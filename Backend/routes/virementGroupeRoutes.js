const express = require("express");
const router = express.Router();
const virementGroupeController = require("../controllers/virementGroupeController");

router.post("/", virementGroupeController.createVirementGroupe);

module.exports = router;
