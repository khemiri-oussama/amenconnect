// routes/carteRoutes.js
const express = require("express");
const router = express.Router();
const carteConttroler = require("../controllers/carteConttroller");


router.post("/addCarte", carteConttroler.addCarte);

module.exports = router;
