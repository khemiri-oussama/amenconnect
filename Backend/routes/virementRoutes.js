// routes/virementRoutes.js
const express = require('express');
const router = express.Router();
const virementController = require('../controllers/virementController');
const verifyToken = require('../middleware/auth');

// Create a new virement (transfer)
router.post('/', verifyToken, virementController.createVirement);

// Get all virements for the authenticated user
router.get('/', verifyToken, virementController.getVirements);

// Get a specific virement by ID
router.get('/:id', verifyToken, virementController.getVirementById);

// Update the status of a virement (e.g., mark as completed)
router.patch('/:id/status', verifyToken, virementController.updateVirementStatus);

// Delete a virement
router.delete('/:id', verifyToken, virementController.deleteVirement);

module.exports = router;
