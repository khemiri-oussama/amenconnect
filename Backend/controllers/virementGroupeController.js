// controllers/virementGroupeController.js
const Compte = require("../models/Compte");
const mongoose = require("mongoose");

exports.createVirementGroupe = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromAccount, virements } = req.body;

    // Validate the sender account exists
    const sender = await Compte.findById(fromAccount).session(session);
    if (!sender) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Compte source introuvable" });
    }

    // Validate each virement entry and calculate total amount
    let totalAmount = 0;
    for (const v of virements) {
      if (!v.beneficiary || !v.amount || v.amount <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Données de virement invalide" });
      }
      totalAmount += v.amount;
    }

    // Check if sender has sufficient funds
    if (sender.solde < totalAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Fonds insuffisants dans le compte source" });
    }

    // Deduct the total amount from the sender's account and record a debit entry
    sender.solde -= totalAmount;
    const groupRef = `VG-${new mongoose.Types.ObjectId().toString().slice(-6)}`;
    sender.historique.push({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount: totalAmount,
      description: "Virement groupé - Débit",
      type: "debit",
      reference: groupRef,
    });
    await sender.save({ session });

    // Process each transfer:
    for (const v of virements) {
      // Lookup the receiver by beneficiary RIB.
      const receiver = await Compte.findOne({ RIB: v.beneficiary }).session(session);
      if (receiver) {
        // If an associated account exists, update its solde and historique.
        receiver.solde += v.amount;
        receiver.historique.push({
          _id: new mongoose.Types.ObjectId(),
          date: new Date(),
          amount: v.amount,
          description: "Virement groupé - Crédit",
          type: "credit",
          reference: groupRef,
        });
        await receiver.save({ session });
      } 
      // If no receiver account exists, the money is sent externally.
      // No historique is added for the receiver.
    }

    // Commit the transaction so that all updates are applied atomically.
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Virements groupés effectués avec succès",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur lors du traitement des virements groupés :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
