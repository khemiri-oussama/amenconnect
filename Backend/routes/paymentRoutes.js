const express = require('express');
const router = express.Router();
const { processQRPayment } = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth'); // to ensure the user is authenticated

// Endpoint to process QR payment
router.post('/qr', verifyToken, processQRPayment);

module.exports = router;
