const VirementProgramme = require("../models/VirementProgramme");
const Compte = require("../models/Compte");

exports.createVirementProgramme = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description, frequency, startDate, endDate } = req.body;

    // Validate existence of the source account
    const sender = await Compte.findById(fromAccount);
    if (!sender) {
      return res.status(404).json({ message: "Compte source introuvable" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: "La date de fin doit être postérieure à la date de début" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Le montant doit être supérieur à 0" });
    }

    // Calculate the number of occurrences based on frequency
    let occurrences = 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    switch (frequency) {
      case "quotidien":
        occurrences = diffDays;
        break;
      case "hebdomadaire":
        occurrences = Math.floor(diffDays / 7);
        break;
      case "mensuel":
        occurrences = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        break;
      case "trimestriel":
        occurrences = Math.floor(((end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())) / 3);
        break;
      case "annuel":
        occurrences = end.getFullYear() - start.getFullYear();
        break;
      default:
        occurrences = 0;
    }
    const totalAmount = occurrences * amount;

    // Create and save the scheduled transfer record
    const virementProgramme = await VirementProgramme.create({
      fromAccount,
      toAccount,
      amount,
      description,
      frequency,
      startDate: start,
      endDate: end,
      occurrences,
      totalAmount,
    });

    res.status(201).json({ message: "Virement programmé créé", data: virementProgramme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
