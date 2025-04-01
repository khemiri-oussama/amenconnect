const Beneficiaire = require("../models/Beneficiaire");
const { generateRIB } = require("../config/helper");

exports.getBeneficiaires = async (req, res) => {
  try {
    // Only return beneficiaries belonging to the current user
    const beneficiaires = await Beneficiaire.find({ userId: req.user.id });
    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createBeneficiaire = async (req, res) => {
  try {
    const { nom, prenom, RIB, banque, email, telephone } = req.body;
    // Remove spaces and validate the RIB format
    const ribClean = RIB.replace(/\s+/g, "");
    if (!/^\d{20}$/.test(ribClean)) {
      return res.status(400).json({
        message: "Le RIB doit contenir exactement 20 chiffres : Code Banque (2), Code Agence (3), Numéro de compte (13), Clé (2)."
      });
    }
    // Generate the IBAN from the RIB
    const iban = generateRIB(ribClean);

    const userId = req.user ? (req.user._id || req.user.id) : "60d21b4667d0d8992e610c85";
    const newBeneficiaire = new Beneficiaire({
      userId,
      nom,
      prenom,
      RIB: ribClean,
      IBAN: iban,  // Store the generated IBAN
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
    // If you allow updating the RIB, re-generate the IBAN if needed
    let updateData = { ...req.body };
    if (updateData.RIB) {
      const ribClean = updateData.RIB.replace(/\s+/g, "");
      if (!/^\d{20}$/.test(ribClean)) {
        return res.status(400).json({
          message: "Le RIB doit contenir exactement 20 chiffres."
        });
      }
      updateData.RIB = ribClean;
      updateData.IBAN = generateRIB(ribClean);
    }
    const updatedBeneficiaire = await Beneficiaire.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );
    if (!updatedBeneficiaire) {
      return res.status(404).json({ message: "Bénéficiaire non trouvé" });
    }
    res.status(200).json(updatedBeneficiaire);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du bénéficiaire", error });
  }
};

exports.deleteBeneficiaire = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Beneficiaire.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Bénéficiaire non trouvé" });
    }
    res.status(200).json({ message: "Bénéficiaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du bénéficiaire", error });
  }
};
