// controllers/virementController.js
const Virement = require("../models/virement");
const Compte = require("../models/Compte");
const mongoose = require("mongoose");
// Import the getIO function without immediately calling it
const { getIO } = require("../server/socket");

exports.createVirement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromAccount, toAccount, amount, description } = req.body;
    if (!fromAccount || !toAccount || !amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Les informations requises sont manquantes" });
    }

    const sender = await Compte.findById(fromAccount).session(session);
    if (!sender) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Compte de l'expéditeur introuvable" });
    }

    if (sender.solde < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Fonds insuffisants dans le compte expéditeur" });
    }

    let processingDelay = 0;
    if (amount > 10000) {
      processingDelay = 30 * 60 * 1000; // 30 minutes delay
    } else if (typeof toAccount === "string" && toAccount.startsWith("07")) {
      const receiver = await Compte.findOne({ RIB: toAccount }).session(session);
      if (receiver) {
        processingDelay = 0; // Process immediately
      } else {
        processingDelay = 5 * 60 * 1000; // 5 minutes delay if receiver not found
      }
    } else {
      processingDelay = 5 * 60 * 1000;
    }
    
    const initialStatus = processingDelay === 0 ? "Completed" : "Scheduled";

    const virementDocs = await Virement.create(
      [{
        fromAccount,
        toAccount,
        amount,
        description,
        status: initialStatus,
      }],
      { session }
    );
    const virementRecord = virementDocs[0];

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

    // Commit the transaction here, as all operations that need atomicity are done.
    await session.commitTransaction();
    session.endSession();

    const sendNotification = (receiverId, notificationData) => {
      const io = getIO();
      io.to(receiverId).emit("virementReceived", notificationData);
    };

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
        sendNotification(receiver.userId.toString(), {
          title: "Nouveau virement reçu",
          message: `Vous avez reçu ${amount} sur votre compte.`,
          virementId: virementRecord._id,
        });
      }
      return res.status(201).json({
        success: true,
        message: "Virement effectué avec succès",
        data: virementRecord,
      });
    } else {
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
            sendNotification(receiver.userId.toString(), {
              title: "Nouveau virement reçu",
              message: `Vous avez reçu ${amount} sur votre compte.`,
              virementId: virementRecord._id,
            });
          }
          await Virement.findByIdAndUpdate(virementRecord._id, { status: "Completed" });
        } catch (err) {
          console.error("Error processing scheduled virement:", err);
        }
      }, processingDelay);

      return res.status(201).json({
        success: true,
        message: `Virement programmé. Il sera traité dans ${processingDelay / 60000} minute(s).`,
        data: virementRecord,
      });
    }
  } catch (error) {
    // Only abort if the session is still in a transaction
    if (session.inTransaction && session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Error creating virement:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
