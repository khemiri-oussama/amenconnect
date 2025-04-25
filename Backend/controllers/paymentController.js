// controllers/paymentController.js
const Carte = require('../models/Cartes'); // Ensure you import your Carte model
const Compte = require("../models/Compte");

exports.processQRPayment = async (req, res) => {
  const { transactionId, amount, cardId, merchant } = req.body;

  if (!transactionId || !amount || !cardId) {
    return res.status(400).json({ message: 'Données de paiement invalides.' });
  }

  try {
    // Retrieve receiver's card and associated account
    const card = await Carte.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée.' });
    }
    const receiverCompte = await Compte.findById(card.comptesId);
    if (!receiverCompte) {
      return res.status(404).json({ message: 'Compte destinataire non trouvé.' });
    }

    // Retrieve payer's account using the authenticated user's id.
    // Use either req.user._id or req.user.id depending on the token structure.
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      console.error("User information missing in request:", req.user);
      return res.status(401).json({ message: 'Authentification requise.' });
    }
    console.log("Authenticated user:", req.user);

    const payerCompte = await Compte.findOne({ userId: userId });
    if (!payerCompte) {
      console.error("No payer account found for user:", userId);
      return res.status(404).json({ message: 'Compte payeur non trouvé.' });
    }

    // Check if payer has sufficient funds
    if (payerCompte.solde < amount) {
      return res.status(400).json({ message: 'Fonds insuffisants dans le compte payeur.' });
    }

    // Deduct the amount from the payer's account and record the debit transaction
    payerCompte.solde -= amount;
    const payerTransaction = {
      date: new Date().toISOString(),
      amount: amount,
      description: `Paiement via QR vers compte ${receiverCompte._id}`,
      type: "debit",
      reference: `QR-PAY-${new Date().getTime()}`,
    };
    if (!payerCompte.historique) payerCompte.historique = [];
    payerCompte.historique.push(payerTransaction);

    // Credit the amount to the receiver's account and record the credit transaction
    receiverCompte.solde += amount;
    const receiverTransaction = {
      date: new Date().toISOString(),
      amount: amount,
      description: `Réception de paiement QR de compte ${payerCompte._id}`,
      type: "credit",
      reference: `QR-REC-${new Date().getTime()}`,
    };
    if (!receiverCompte.historique) receiverCompte.historique = [];
    receiverCompte.historique.push(receiverTransaction);

    // Save both accounts
    await payerCompte.save();
    await receiverCompte.save();

    // Optionally update the card's monthly expenses for the receiver
    if (card.monthlyExpenses && typeof card.monthlyExpenses.current === "number") {
      card.monthlyExpenses.current += amount;
      await card.save();
    }

    return res.status(200).json({ message: 'Paiement traité avec succès.' });
  } catch (err) {
    console.error('Erreur de paiement QR:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.processPayment = async (req, res) => {
  const { cardId, user, amount,merchantType } = req.body;

  if (!cardId || !user || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Fetch the card
    const card = await Carte.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Fetch the associated account
    const compte = await Compte.findById(card.comptesId);
    if (!compte) {
      return res.status(404).json({ message: "Compte not found" });
    }

    // Check for sufficient funds
    if (compte.solde < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct amount from account balance
    compte.solde -= amount;

    // Build transaction description
    const description = `Payment avec : ${card.TypeCarte}`;

    // Create account historique transaction
    const accountTransaction = {
      date: new Date().toISOString(),
      amount: amount,
      description: description,
      type: "debit",
      reference: "REF-" + new Date().getTime(),
    };
    compte.historique.push(accountTransaction);

    // Create credit card transaction
    const cardTransaction = {
      amount: amount,
      description: description,
      transactionDate: new Date(),
      currency: "TND",
      merchant: merchantType, // You can customize this if needed
      status: "Completed",
    };
    card.creditCardTransactions.push(cardTransaction);
    card.monthlyExpenses.current += amount;

    // Save both updated documents
    await compte.save();
    await card.save();

    res.status(200).json({
      message: "Payment processed and recorded successfully.",
      newBalance: compte.solde,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Server error during payment processing" });
  }
};
