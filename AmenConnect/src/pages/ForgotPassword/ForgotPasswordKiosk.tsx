"use client"

import type React from "react"
import { useState } from "react"
import { IonIcon } from "@ionic/react"
import { arrowBack, mailOutline } from "ionicons/icons"

interface ForgotPasswordKioskProps {
  onBack: () => void
  onSubmit: (email: string) => Promise<void>
}

const ForgotPasswordKiosk: React.FC<ForgotPasswordKioskProps> = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!email) {
      setErrorMessage("Veuillez entrer votre adresse e-mail.")
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(email)
      setSuccessMessage("Un e-mail de réinitialisation a été envoyé à votre adresse.")
      setEmail("")
    } catch (error: any) {
      setErrorMessage(error.message || "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="loginkiosk-back-button" onClick={onBack}>
        <IonIcon icon={arrowBack} />
        <span>Retour</span>
      </div>

      <h2 className="loginkiosk-subtitle">Réinitialisation du mot de passe</h2>
      <p className="loginkiosk-instruction">
        Entrez votre adresse e-mail ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <form className="loginkiosk-form" onSubmit={handleSubmit}>
        <div className="loginkiosk-form-group">
          <label htmlFor="email" className="loginkiosk-label">
            Adresse e-mail
          </label>
          <div className="loginkiosk-input-container">
            <IonIcon icon={mailOutline} className="loginkiosk-input-icon" />
            <input
              type="email"
              id="email"
              className="loginkiosk-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre adresse e-mail"
              required
            />
          </div>
        </div>

        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="success-message" style={{ color: "green" }}>
            {successMessage}
          </p>
        )}

        <button type="submit" className="loginkiosk-btn" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordKiosk

