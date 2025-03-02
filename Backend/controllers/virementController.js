// controllers/virementController.js
const mongoose = require("mongoose");
const Virement = require("../models/virement");
const User = require("../models/User");

// Function to create a new virement
exports.makeVirement = async (req, res) => {
  const {
    userId,
    sourceAccount,
    destinationAccount,
    amount,
    currency,
    transferType,
    reason,
    beneficiaryName,
    beneficiaryBank
  } = req.body;

  try {
    // Validate that the user exists.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Additional validations can be added here (e.g., checking account balance, valid amount, etc.)

    // Create the new Virement document.
    const newVirement = new Virement({
      user: userId,
      sourceAccount,
      destinationAccount,
      amount,
      currency: currency || 'TND', // Default to 'TND' if not provided.
      transferType, // Should be either 'internal' or 'external'
      reason,
      beneficiaryName,
      beneficiaryBank
      // transferDate defaults to Date.now and status defaults to 'pending'
    });

    await newVirement.save();
    res.status(201).json({
      message: "Virement created successfully.",
      virement: newVirement
    });
  } catch (err) {
    console.error("Make Virement error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// Function to update the virement status
exports.updateVirementStatus = async (req, res) => {
  const { virementId, status } = req.body;

  // Define the allowed statuses.
  const allowedStatuses = ["pending", "completed", "failed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status provided. Allowed statuses are: ${allowedStatuses.join(", ")}.`
    });
  }

  try {
    // Find the virement by its ID and update the status.
    const updatedVirement = await Virement.findByIdAndUpdate(
      virementId,
      { status, updatedAt: new Date().toISOString() },
      { new: true } // Return the updated document.
    );

    if (!updatedVirement) {
      return res.status(404).json({ message: "Virement not found." });
    }

    res.status(200).json({
      message: "Virement status updated successfully.",
      virement: updatedVirement
    });
  } catch (err) {
    console.error("Update Virement Status error:", err);
    res.status(500).json({ message: "Server error." });
  }
};
