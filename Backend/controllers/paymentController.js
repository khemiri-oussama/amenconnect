// controllers/paymentController.js
const Carte = require('../models/Cartes'); // Ensure you import your Carte model
// You may also want to import a Transaction model if you record payments.

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
    // For example, you might use a Transaction model to record details.

    return res.status(200).json({ message: 'Paiement traité avec succès.' });
  } catch (err) {
    console.error('Erreur de paiement QR:', err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};
