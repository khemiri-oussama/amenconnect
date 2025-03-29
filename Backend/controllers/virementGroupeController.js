const VirementGroupe = require("../models/VirementGroupe");
const Compte = require("../models/Compte");

exports.createVirementGroupe = async (req, res) => {
  try {
    const { fromAccount, virements } = req.body;

    // Validate source account exists
    const sender = await Compte.findById(fromAccount);
    if (!sender) {
      return res.status(404).json({ message: "Compte source introuvable" });
    }

    // Validate each virement entry in the group
    for (const v of virements) {
      if (!v.beneficiary || !v.amount || v.amount <= 0) {
        return res.status(400).json({ message: "Données de virement invalide" });
      }
    }

    // Create the group virement record
    const virementGroupe = await VirementGroupe.create({
      fromAccount,
      virements,
    });

    res.status(201).json({ message: "Virements groupés créés", data: virementGroupe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
