// routes/paymentRoutes.js
const express = require("express")
const router = express.Router()
const { processPayment, processQRPayment } = require("../controllers/paymentController")
const verifyToken = require("../middleware/auth") // Ensure the user is authenticated

// Endpoint to process a regular payment
router.post("/process", verifyToken, processPayment)

// Endpoint to process a QR payment
router.post("/qr", verifyToken, processQRPayment)

module.exports = router
