// controllers/virementController.js
const Virement = require("../models/virement");
const Compte = require("../models/Compte");

exports.createVirement = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;

    // Validate sender account
    const sender = await Compte.findById(fromAccount);
    if (!sender) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Find the receiver account using its RIB
    const receiver = await Compte.findOne({ RIB: toAccount });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver account not found using provided RIB" });
    }

    // Check if sender has sufficient funds
    if (sender.solde < amount) {
      return res.status(400).json({ message: "Insufficient funds in sender account" });
    }

    // Create virement record (assuming immediate completion for simplicity)
    const virement = await Virement.create({
      fromAccount,
      toAccount: receiver._id, // you might store the internal id for reference
      amount,
      description,
      status: "Completed",
    });

    // Update sender and receiver account balances
    sender.solde -= amount;
    receiver.solde += amount;
    await sender.save();
    await receiver.save();

    res.status(201).json({ message: "Virement successful", data: virement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
