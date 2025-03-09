// routes/transactionRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Compte = require('../models/Compte');
const router = express.Router();

/**
 * POST /api/compte/:accountId/transaction
 * Adds a new transaction to the historique array of a Compte.
 * 
 * Request Body:
 * {
 *   "amount": number,
 *   "type": "credit" or "debit",
 *   "category": string, // e.g., "transport", "shopping", "loisir", "restaurant", etc.
 *   "description": string, // optional
 *   "date": string // optional ISO date string; defaults to now if not provided
 * }
 */
router.post(
  '/:accountId/transaction',
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['credit', 'debit']).withMessage('Type must be either credit or debit'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').optional().isString(),
    body('date').optional().isISO8601().withMessage('Invalid date format')
  ],
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountId } = req.params;
    const { amount, type, category, description, date } = req.body;

    try {
      // Find the account by ID
      const compte = await Compte.findById(accountId);
      if (!compte) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Create the new transaction object
      const transaction = {
        amount,
        type,
        category,
        description: description || "",
        date: date || new Date().toISOString()
      };

      // Push the transaction into the historique array
      compte.historique.push(transaction);

      // Optionally update monthlyExpenses (if type is debit, add the amount)
      if (type === 'debit') {
        compte.monthlyExpenses = (compte.monthlyExpenses || 0) + amount;
      }

      // Save the updated account document
      await compte.save();

      res.status(200).json({
        message: 'Transaction added successfully',
        transaction
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
