// controllers/beneficiaryController.js
const Beneficiary = require('../models/Beneficiary');

exports.addBeneficiary = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user); // Debug log

    const { name, accountNumber, bankName, IBAN } = req.body;

    // Use req.user.id since that's the property in your token payload
    const beneficiary = new Beneficiary({
      userId: req.user.id,
      name,
      accountNumber,
      bankName,
      IBAN,
    });

    await beneficiary.save();
    return res.status(201).json({ message: "Beneficiary added successfully", beneficiary });
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  

exports.getBeneficiaries = async (req, res) => {
  try {
    // Retrieve all beneficiaries for the authenticated user
    const beneficiaries = await Beneficiary.find({ userId: req.user._id });
    return res.status(200).json(beneficiaries);
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
