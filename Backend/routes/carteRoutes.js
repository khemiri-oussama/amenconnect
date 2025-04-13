// routes/carteRoutes.js
const express = require("express")
const router = express.Router()
const carteController = require("../controllers/carteConttroller")
const verifyToken = require("../middleware/auth")  // Token verification middleware

/**
 * @swagger
 * /api/carte/updateStatus:
 *   patch:
 *     summary: Update the status of a carte.
 *     tags: [Carte]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carteId
 *               - status
 *             properties:
 *               carteId:
 *                 type: string
 *                 description: The ID of the carte.
 *                 example: "609c1bde9f1b2a5a8f2c123"
 *               status:
 *                 type: string
 *                 description: The new status for the carte (Active or Bloquer).
 *                 example: "Bloquer"
 *     responses:
 *       200:
 *         description: Carte status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Carte status updated successfully."
 *                 carte:
 *                   $ref: '#/components/schemas/Carte'
 *       400:
 *         description: Invalid status provided.
 *       404:
 *         description: Carte not found.
 *       500:
 *         description: Server error.
 */
router.patch("/updateStatus", verifyToken, carteController.updateCarteStatus)

// Endpoint to add a new carte
router.post("/addCarte", carteController.addCarte)

module.exports = router
