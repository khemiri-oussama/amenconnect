// controllers/paymentController.js
const Carte = require('../models/Cartes'); // Ensure you import your Carte model
const Compte = require("../models/Compte");

exports.processQRPayment = async (req, res) => {
  const { transactionId, amount, cardId, merchant } = req.body;

  if (!transactionId || !amount || !cardId) {
    return res.status(400).json({ message: 'Données de paiement invalides.' });
  }

  try {
    // Find the card by its ID
    const card = await Carte.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée.' });
    }

    // Check if the card has sufficient funds (for debit cards)
    if (card.balance < amount) {
      return res.status(400).json({ message: 'Fonds insuffisants.' });
    }

    // Process the payment:
    // - Deduct the amount from the card balance.
    // - Optionally, create a new transaction record.
    card.balance -= amount;
    card.UpdatedAt = new Date().toISOString();

    // Save the updated card information
    await card.save();

    // Optionally, record the transaction in a separate collection/model.

    return res.status(200).json({ message: 'Paiement traité avec succès.' });
  } catch (err) {
    console.error('Erreur de paiement QR:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.processPayment = async (req, res) => {
  const { cardId, userId, amount,merchantType } = req.body;

  if (!cardId || !userId || !amount) {
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
