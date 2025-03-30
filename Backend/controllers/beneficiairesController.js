// controllers/beneficiairesController.js
const Beneficiaire = require("../models/Beneficiaire");

exports.getBeneficiaires = async (req, res) => {
  try {
    // Only return beneficiaries belonging to the current user
    const beneficiaires = await Beneficiaire.find({ userId: req.user.id });
    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// In createBeneficiaire controller (for testing only)
exports.createBeneficiaire = async (req, res) => {
  try {
    const { nom, prenom, RIB, banque, email, telephone } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : "60d21b4667d0d8992e610c85"; 
    const newBeneficiaire = new Beneficiaire({
      userId,
      nom,
      prenom,
      RIB,
      banque,
      email,
      telephone,
    });
    const savedBeneficiaire = await newBeneficiaire.save();
    res.status(201).json(savedBeneficiaire);
  } catch (error) {
    console.error("Error in createBeneficiaire:", error);
    res.status(500).json({ message: "Erreur lors de la création du bénéficiaire", error });
  }
};

exports.updateBeneficiaire = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure that only the owner can update
    const updatedBeneficiaire = await Beneficiaire.findOneAndUpdate(
      {  _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );
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
    // Ensure that only the owner can delete
    const deleted = await Beneficiaire.findOneAndDelete({ _id: id, userId: req.user.id });
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
