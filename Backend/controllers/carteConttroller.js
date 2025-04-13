// controllers/carteConttroler.js
const mongoose = require("mongoose")
const Carte = require("../models/Cartes")
const Compte = require("../models/Compte")

// Helper function: Generate a random 16-digit card number.
const generateCardNumber = () => {
  let cardNumber = ""
  for (let i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10).toString()
  }
  return cardNumber
}

// Helper function: Generate an expiry date 4 years from now.
const generateExpiryDate = () => {
  const now = new Date()
  const year = now.getFullYear() + 4
  const month = now.getMonth() + 1
  const formattedMonth = month < 10 ? "0" + month : month
  const formattedYear = year.toString().slice(-2)
  return `${formattedMonth}/${formattedYear}`
}

// Create a new carte (card)
exports.addCarte = async (req, res) => {
  const { comptesId, CardHolder, TypeCarte } = req.body
  try {
    // Validate that the compte (account) exists.
    const compte = await Compte.findById(comptesId)
    if (!compte) {
      return res.status(404).json({ message: "Compte not found." })
    }
    // Generate card details.
    const cardNumber = generateCardNumber()
    const expiryDate = generateExpiryDate()
    const now = new Date().toISOString()

    // Create the new Carte document.
    const newCarte = new Carte({
      CardNumber: cardNumber,
      ExpiryDate: expiryDate,
      CardHolder,
      CreatedAt: now,
      UpdatedAt: now,
      comptesId,
      TypeCarte: TypeCarte || "debit", // Default to debit if not provided.
    })

    await newCarte.save()
    res.status(201).json({ message: "Carte added successfully.", carte: newCarte })
  } catch (err) {
    console.error("Add Carte error:", err)
    res.status(500).json({ message: "Server error." })
  }
}

// Update the status of an existing carte.
exports.updateCarteStatus = async (req, res) => {
  const { carteId, status } = req.body
  // Allowed statuses for the carte.
  const allowedStatuses = ["Active", "Bloquer"]
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status provided. Allowed statuses are: ${allowedStatuses.join(", ")}.`
    })
  }

  try {
    // Update the card status and timestamp.
    const updatedCarte = await Carte.findByIdAndUpdate(
      carteId,
      { cardStatus: status, UpdatedAt: new Date().toISOString() },
      { new: true }
    )

    if (!updatedCarte) {
      return res.status(404).json({ message: "Carte not found." })
    }

    res.status(200).json({
      message: "Carte status updated successfully.",
      carte: updatedCarte
    })
  } catch (err) {
    console.error("Update Carte Status error:", err)
    res.status(500).json({ message: "Server error." })
  }
}
