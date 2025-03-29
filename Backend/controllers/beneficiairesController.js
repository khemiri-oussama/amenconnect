// controllers/beneficiairesController.js
const Beneficiaire = require("../models/Beneficiaire");

exports.getBeneficiaires = async (req, res) => {
  try {
    const beneficiaires = await Beneficiaire.find();
    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createBeneficiaire = async (req, res) => {
  try {
    const { nom, prenom, numeroCompte, banque, email, telephone } = req.body;
    const newBeneficiaire = new Beneficiaire({
      nom,
      prenom,
      numeroCompte,
      banque,
      email,
      telephone,
    });
    const savedBeneficiaire = await newBeneficiaire.save();
    res.status(201).json(savedBeneficiaire);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du bénéficiaire", error });
  }
};

exports.updateBeneficiaire = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBeneficiaire = await Beneficiaire.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBeneficiaire) {
      return res.status(404).json({ message: "Bénéficiaire non trouvé" });
    }
    res.status(200).json(updatedBeneficiaire);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du bénéficiaire", error });
  }
};

exports.deleteBeneficiaire = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Beneficiaire.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Bénéficiaire non trouvé" });
    }
    res.status(200).json({ message: "Bénéficiaire supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du bénéficiaire", error });
  }
};
