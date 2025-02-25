// routes/carteRoutes.js
const express = require("express");
const router = express.Router();
const carteConttroler = require("../controllers/carteConttroller");
const verifyToken = require("../middleware/auth");  // Import your token verification middleware

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
router.patch("/updateStatus", verifyToken, carteConttroler.updateCarteStatus);

/**
 * @swagger
 * /api/carte/addCarte:
 *   post:
 *     summary: Add a new carte for a compte.
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
 *               - comptesId
 *               - CardHolder
 *             properties:
 *               comptesId:
 *                 type: string
 *                 description: The ID of the compte the card is linked to.
 *                 example: "60f1c1bde9f1b2a5a8f2c123"
 *               CardHolder:
 *                 type: string
 *                 description: The name of the card holder.
 *                 example: "John Doe"
 *               TypeCarte:
 *                 type: string
 *                 description: The type of the card (e.g., debit, credit).
 *                 example: "debit"
 *     responses:
 *       201:
 *         description: Carte added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Carte added successfully."
 *                 carte:
 *                   $ref: '#/components/schemas/Carte'
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Compte not found.
 *       500:
 *         description: Server error.
 */
router.post("/addCarte", verifyToken, carteConttroler.addCarte);

module.exports = router;
