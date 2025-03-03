// controllers/virementController.js
const mongoose = require("mongoose");
const Virement = require("../models/virement");
const Compte = require("../models/Compte");
const User = require("../models/User");

// Function to create a new virement using compte IDs
exports.makeVirement = async (req, res) => {
  const {
    sourceCompteId,       // New field: source account ID
    destinationCompteId,  // New field: destination account ID
    amount,
    currency,
    transferType,         // 'internal' or 'external'
    reason,
    beneficiaryName,
    beneficiaryBank
  } = req.body;

  try {
    // Get the user from the JWT middleware (assumes req.user is populated)
    const userId = req.user.id;

    // Validate that the source compte exists and belongs to the user.
    const sourceCompte = await Compte.findOne({ _id: sourceCompteId, userId });
    if (!sourceCompte) {
      return res.status(404).json({ message: "Source account not found or not associated with this user." });
    }

    // Validate that the destination compte exists.
    // For internal transfers, you might check if the destination account exists in your system.
    const destinationCompte = await Compte.findById(destinationCompteId);
    if (!destinationCompte) {
      return res.status(404).json({ message: "Destination account not found." });
    }

    // Example additional validation: Check if the source account has sufficient balance.
    if (sourceCompte.solde < amount) {
      return res.status(400).json({ message: "Insufficient balance in the source account." });
    }

    // Create the new Virement document.
    const newVirement = new Virement({
      user: userId,  // Associate the transfer with the logged-in user.
      sourceAccount: sourceCompteId,      // Now using compte IDs
      destinationAccount: destinationCompteId,
      amount,
      currency: currency || 'TND', // Default to 'TND' if not provided.
      transferType,              // Should be either 'internal' or 'external'
      reason,
      beneficiaryName,
      beneficiaryBank
      // transferDate and status have default values in the schema.
    });

    await newVirement.save();

    // Optionally, update the account balances here if that logic is part of your workflow.
    // e.g., subtract from sourceCompte.solde and add to destinationCompte.solde for internal transfers.

    res.status(201).json({
      message: "Virement created successfully.",
      virement: newVirement
    });
  } catch (err) {
    console.error("Make Virement error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
