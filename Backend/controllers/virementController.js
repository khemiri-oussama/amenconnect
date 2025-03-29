const Virement = require("../models/Virement");
const Compte = require("../models/Compte");

exports.createVirement = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description } = req.body;

    // Validate sender and receiver accounts
    const sender = await Compte.findById(fromAccount);
    const receiver = await Compte.findById(toAccount);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver account not found" });
    }

    // Check if sender has sufficient funds
    if (sender.solde < amount) {
      return res.status(400).json({ message: "Insufficient funds in sender account" });
    }

    // Create virement record (assuming immediate completion for simplicity)
    const virement = await Virement.create({
      fromAccount,
      toAccount,
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
