const User = require("../models/User")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const generateResetPasswordEmailHTML = (resetLink) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de Mot de Passe</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #1E1E1E; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo img { width: 150px; height: auto; }
        .header { text-align: center; font-size: 28px; font-weight: bold; color: #121660; margin-bottom: 30px; }
        .reset-container { background-color: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
        .reset-button { display: block; width: 200px; margin: 0 auto; padding: 15px; background-color: #47CE65; color: #ffffff; text-align: center; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px; }
        .message { text-align: center; font-size: 18px; color: #1E1E1E; margin-bottom: 30px; line-height: 1.6; }
        .footer { text-align: center; font-size: 14px; color: #47B3CE; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(71, 179, 206, 0.3); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://www.amenbank.com.tn/img/logo.jpg" alt="AmenBank">
        </div>
        <div class="header">
          Réinitialisez Votre Mot de Passe
        </div>
        <div class="reset-container">
          <a href="${resetLink}" class="reset-button">Réinitialiser</a>
        </div>
        <div class="message">
          <p>Cliquez sur le bouton ci-dessus pour réinitialiser votre mot de passe.</p>
          <p>Ce lien expirera dans <strong>1 heure</strong>.</p>
        </div>
        <div class="footer">
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail ou contacter immédiatement notre équipe d'assistance.</p>
          <p>&copy; 2025 AmenBank. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

exports.forgotPassword = async (req, res) => {
  const { cin } = req.body
  try {
    const user = await User.findOne({ cin })
    if (!user) {
      return res.status(404).json({ message: "Utilisateur avec ce CIN non trouvé." })
    }

    // Generate a unique token and set expiration time
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = Date.now() + 3600000 // Token expires in 1 hour

    // Store token and expiration in database
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetExpires
    await user.save()

    // Create reset link
    const resetLink = `${process.env.CLIENT_ORIGIN}/ResetPassword?token=${resetToken}`

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Réinitialisez Votre Mot de Passe",
      html: generateResetPasswordEmailHTML(resetLink),
    }

    await transporter.sendMail(mailOptions)
    res.json({ message: "Lien de réinitialisation du mot de passe envoyé à votre email." })
  } catch (error) {
    console.error("Erreur de mot de passe oublié:", error)
    res.status(500).json({ message: "Erreur du serveur." })
  }
}

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is still valid
    })

    if (!user) {
      return res.status(400).json({ message: "Jeton invalide ou expiré." })
    }

    // Assign the plain text password; the pre-save hook will hash it once
    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    res.json({ message: "Mot de passe réinitialisé avec succès." })
  } catch (error) {
    console.error("Erreur de réinitialisation du mot de passe:", error)
    res.status(500).json({ message: "Erreur du serveur." })
  }
}

