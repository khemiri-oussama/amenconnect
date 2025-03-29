const express = require("express");
const router = express.Router();
const virementProgrammeController = require("../controllers/virementProgrammeController");

router.post("/", virementProgrammeController.createVirementProgramme);

module.exports = router;
