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
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Les informations requises sont manquantes" });
    }

    // Validate sender account
    const sender = await Compte.findById(fromAccount).session(session);
    if (!sender) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Compte de l'expéditeur introuvable" });
    }

    // Check if sender has sufficient funds
    if (sender.solde < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Fonds insuffisants dans le compte expéditeur" });
    }

    // Determine processing delay and initial status
    let processingDelay = 0;
    if (amount > 10000) {
      processingDelay = 30 * 60 * 1000; // 30 minutes delay
    } else if (typeof toAccount === "string" && toAccount.startsWith("07")) {
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
    const virementDocs = await Virement.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          description,
          status: initialStatus,
        },
      ],
      { session }
    );
    const virementRecord = virementDocs[0];

    // Reserve funds from the sender account and update sender's historique
    sender.solde -= amount;
    const senderTransaction = {
      _id: new mongoose.Types.ObjectId(),
      date: new Date(),
      amount,
      description,
      type: "debit",
      reference: `VIR-${virementRecord._id.toString().slice(-6)}`,
    };
    sender.historique.push(senderTransaction);
    await sender.save({ session });

    // Commit transaction for immediate reservation of funds
    await session.commitTransaction();
    session.endSession();

    // Immediate processing: if no delay, update the receiver's account right away
    if (processingDelay === 0) {
      const receiver = await Compte.findOne({ RIB: toAccount });
      if (receiver) {
        receiver.solde += amount;
        const receiverTransaction = {
          _id: new mongoose.Types.ObjectId(),
          date: new Date(),
          amount,
          description,
          type: "credit",
          reference: `VIR-${virementRecord._id.toString().slice(-6)}`,
        };
        receiver.historique.push(receiverTransaction);
        await receiver.save();
      }
      return res.status(201).json({
        success: true,
        message: "Virement effectué avec succès",
        data: virementRecord,
      });
    } else {
      // Scheduled processing: Use a delayed task.
      setTimeout(async () => {
        try {
          const receiver = await Compte.findOne({ RIB: toAccount });
          if (receiver) {
            receiver.solde += amount;
            const receiverTransaction = {
              _id: new mongoose.Types.ObjectId(),
              date: new Date(),
              amount,
              description,
              type: "credit",
              reference: `VIR-${virementRecord._id.toString().slice(-6)}`,
            };
            receiver.historique.push(receiverTransaction);
            await receiver.save();
          }
          // Update the virement record status to "Completed"
          await Virement.findByIdAndUpdate(virementRecord._id, { status: "Completed" });
        } catch (err) {
          console.error("Error processing scheduled virement:", err);
          // Optionally, implement alerts or retry mechanisms here.
        }
      }, processingDelay);

      return res.status(201).json({
        success: true,
        message: `Virement programmé. Il sera traité dans ${processingDelay / 60000} minute(s).`,
        data: virementRecord,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating virement:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
