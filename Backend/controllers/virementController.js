// controllers/virementController.js
const Virement = require("../models/virement");
const Compte = require("../models/Compte");
const mongoose = require("mongoose");

exports.createVirement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromAccount, toAccount, amount, description } = req.body;

    // Validate input
    if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({ message: "Les informations requises sont manquantes" });
    }

    // Validate sender account
    const sender = await Compte.findById(fromAccount).session(session);
    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Compte de l'expéditeur introuvable" });
    }

    // Check if sender has sufficient funds
    if (sender.solde < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Fonds insuffisants dans le compte expéditeur" });
    }

    // Determine processing delay and initial status
    let processingDelay = 0;
    if (amount > 10000) {
      processingDelay = 30 * 60 * 1000; // 30 minutes delay
    } else if (toAccount.startsWith("07")) {
      // Look for a receiver account by RIB
      const receiver = await Compte.findOne({ RIB: toAccount }).session(session);
      if (receiver) {
        processingDelay = 0; // Process immediately
      } else {
        processingDelay = 5 * 60 * 1000; // 5 minutes delay if receiver not found
      }
    } else {
      processingDelay = 5 * 60 * 1000; // 5 minutes delay for other RIB formats
    }

    const initialStatus = processingDelay === 0 ? "Completed" : "Scheduled";

    // Create the virement record within the transaction
    const virement = await Virement.create(
      [{
        fromAccount,
        toAccount,
        amount,
        description,
        status: initialStatus,
      }],
      { session }
    );

    // Reserve funds from the sender account
    sender.solde -= amount;
    await sender.save({ session });

    // Commit transaction for immediate reservation of funds
    await session.commitTransaction();
    session.endSession();

    // Immediate processing: if no delay, update the receiver's account right away
    if (processingDelay === 0) {
      const receiver = await Compte.findOne({ RIB: toAccount });
      if (receiver) {
        receiver.solde += amount;
        await receiver.save();
      }
      return res.status(201).json({
        success: true,
        message: "Virement effectué avec succès",
        data: virement[0],
      });
    } else {
      // Scheduled processing: Use a delayed task.
      // In a production environment, you might integrate a job queue (like Bull or Agenda)
      // to handle delayed processing reliably.
      setTimeout(async () => {
        try {
          const receiver = await Compte.findOne({ RIB: toAccount });
          if (receiver) {
            receiver.solde += amount;
            await receiver.save();
          }
          // Update the virement record status to "Completed"
          await Virement.findByIdAndUpdate(virement[0]._id, { status: "Completed" });
        } catch (err) {
          console.error("Error processing scheduled virement:", err);
          // Here you might also trigger alerts or a retry mechanism.
        }
      }, processingDelay);

      return res.status(201).json({
        success: true,
        message: `Virement programmé. Il sera traité dans ${processingDelay / 60000} minute(s).`,
        data: virement[0],
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating virement:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
