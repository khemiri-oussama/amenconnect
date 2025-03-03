// controllers/virementController.js
const Virement = require('../models/Virement');
const Compte = require('../models/Compte');

exports.createVirement = async (req, res) => {
  try {
    const {
      beneficiaryId,
      beneficiaryName,
      accountFrom,
      accountTo,
      amount,
      reason,
      date,
      frequency,
      nextDate,
      endDate,
    } = req.body;

    // Find the user's account based on the RIB and user ID (assumed to be set by your auth middleware)
    const compte = await Compte.findOne({ RIB: accountFrom, userId: req.user._id });
    if (!compte) {
      return res.status(404).json({ message: "Account not found" });
    }
    

    if (compte.solde < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // For immediate transfers, deduct the transfer amount from the account balance
    if (frequency === 'once') {
      compte.solde -= amount;
      await compte.save();
    }

    // Create a new virement document
    const newVirement = new Virement({
      userId: req.user._id,
      beneficiaryId,
      beneficiaryName,
      accountFrom,
      accountTo,
      amount,
      reason,
      date,
      status: 'pending',
      frequency,
      nextDate: frequency !== 'once' ? nextDate : undefined,
      endDate: frequency !== 'once' ? endDate : undefined,
    });

    await newVirement.save();
    return res.status(201).json(newVirement);
  } catch (error) {
    console.error("Error creating virement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVirements = async (req, res) => {
  try {
    const virements = await Virement.find({ userId: req.user._id });
    return res.status(200).json(virements);
  } catch (error) {
    console.error("Error fetching virements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVirementById = async (req, res) => {
  try {
    const virement = await Virement.findOne({ _id: req.params.id, userId: req.user._id });
    if (!virement) {
      return res.status(404).json({ message: "Virement not found" });
    }
    return res.status(200).json(virement);
  } catch (error) {
    console.error("Error fetching virement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateVirementStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Update the transfer status (e.g., from pending to completed)
    const virement = await Virement.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!virement) {
      return res.status(404).json({ message: "Virement not found" });
    }
    return res.status(200).json(virement);
  } catch (error) {
    console.error("Error updating virement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteVirement = async (req, res) => {
  try {
    const virement = await Virement.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!virement) {
      return res.status(404).json({ message: "Virement not found" });
    }
    return res.status(200).json({ message: "Virement deleted successfully" });
  } catch (error) {
    console.error("Error deleting virement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
