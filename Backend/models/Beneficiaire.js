// models/Beneficiaire.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeneficiaireSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  RIB: { type: String, required: true, unique: true }, // New field
  banque: { type: String, required: true },
  email: { type: String },
  telephone: { type: String },
  dateAjout: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Beneficiaire", BeneficiaireSchema);

