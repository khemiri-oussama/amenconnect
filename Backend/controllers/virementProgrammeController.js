// controllers/virementProgrammeController.js
const VirementProgramme = require("../models/VirementProgramme");
const Compte = require("../models/Compte");
const mongoose = require("mongoose");

exports.createVirementProgramme = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromAccount, toAccount, amount, description, frequency, startDate, endDate } = req.body;

    // Validate existence of the sender account
    const sender = await Compte.findById(fromAccount).session(session);
    if (!sender) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Compte source introuvable" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "La date de fin doit être postérieure à la date de début" });
    }
    if (amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Le montant doit être supérieur à 0" });
    }

    // Calculate the number of occurrences based on frequency
    let occurrences = 0;
    const diffTime = end.getTime() - start.getTime();
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
    if (occurrences <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Aucune occurrence de virement programmé calculée" });
    }
    const totalAmount = occurrences * amount;

    // Check if sender has sufficient funds for all occurrences
    if (sender.solde < totalAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Fonds insuffisants dans le compte source pour toutes les occurrences" });
    }

    // Deduct total amount immediately and add a debit historique entry
    sender.solde -= totalAmount;
    const programmeRef = `VP-${new mongoose.Types.ObjectId().toString().slice(-6)}`;
    sender.historique.push({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount: totalAmount,
      description: "Virement programmé - Débit",
      type: "debit",
      reference: programmeRef,
    });
    await sender.save({ session });

    // Create the scheduled virement programme record
    const virementProgrammeDocs = await VirementProgramme.create(
      [{
        fromAccount,
        toAccount,
        amount,
        description,
        frequency,
        startDate: start,
        endDate: end,
        occurrences,
        totalAmount,
        status: "Scheduled"
      }],
      { session }
    );
    const programmeRecord = virementProgrammeDocs[0];

    // Commit transaction so sender update and programme record are saved atomically
    await session.commitTransaction();
    session.endSession();

    // Schedule each occurrence transfer.
    // We assume occurrences are evenly spaced between startDate and endDate.
    // Calculate interval between occurrences in milliseconds.
    const interval = diffTime / occurrences;
    for (let i = 0; i < occurrences; i++) {
      // Calculate delay until the i-th occurrence
      const delay = start.getTime() - Date.now() + i * interval;
      setTimeout(async () => {
        try {
          // Process transfer for this occurrence
          const receiver = await Compte.findById(toAccount);
          if (receiver) {
            receiver.solde += amount;
            receiver.historique.push({
              _id: new mongoose.Types.ObjectId(),
              date: new Date(),
              amount: amount,
              description: `Virement programmé - Crédit (Occurrence ${i + 1})`,
              type: "credit",
              reference: programmeRef,
            });
            await receiver.save();
          }
        } catch (err) {
          console.error(`Erreur lors du traitement du virement programmé occurrence ${i + 1}:`, err);
        }
      }, delay);
    }

    return res.status(201).json({
      success: true,
      message: "Virement programmé créé et planifié",
      data: programmeRecord,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur lors de la création du virement programmé:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
