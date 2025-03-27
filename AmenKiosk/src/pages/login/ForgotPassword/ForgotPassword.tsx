"use client"

import type React from "react"
import { useState } from "react"
import { IonIcon } from "@ionic/react"
import { idCardOutline } from "ionicons/icons"
import axios from "axios"

interface ForgotPasswordKioskProps {
  onBack: () => void
  onSubmit?: (email: string) => Promise<void>
}

const ForgotPasswordKiosk: React.FC<ForgotPasswordKioskProps> = ({ onBack, onSubmit }) => {
  const [CIN, setCIN] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (!CIN.trim() || CIN.length !== 8 || !/^[0-9]+$/.test(CIN)) {
      setErrorMessage("Veuillez saisir un numéro CIN valide à 8 chiffres.")
      return
    }

    setIsLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(CIN)
        setSuccessMessage("Un e-mail de réinitialisation a été envoyé à l'adresse associée à ce CIN.")
      } else {
        const response = await axios.post("/api/password/forgot-password", { cin: CIN })
        setSuccessMessage(
          response.data.message || "Un e-mail de réinitialisation a été envoyé à l'adresse associée à ce CIN.",
        )
      }
      setCIN("")
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="loginkiosk-bg-circle-1"></div>
      <div className="loginkiosk-bg-circle-2"></div>
      <div className="loginkiosk-bg-blob"></div>

      <div className="loginkiosk-logo">
        <img src="favicon.png" alt="Amen Bank Logo" className="loginkiosk-img" />
      </div>

      <h2 className="loginkiosk-subtitle">Réinitialisation du mot de passe</h2>
      <p className="loginkiosk-instruction">
        Entrez votre numéro CIN ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <form className="loginkiosk-form" onSubmit={handleSubmit}>
        <div className="kiosk-form-group">
          <label htmlFor="cin" className="kiosk-label">
            Numéro CIN
          </label>
          <div className="loginkiosk-input-container">
            <IonIcon icon={idCardOutline} className="loginkiosk-input-icon" />
            <input
              type="text"
              id="cin"
              className="kiosk-input"
              value={CIN}
              onChange={(e) => setCIN(e.target.value)}
              placeholder="Entrez votre numéro CIN"
              maxLength={8}
              minLength={8}
              required
            />
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="kiosk-btn" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
      </form>

      <p className="loginkiosk-message">
        La réussite est à
        <br />
        portée de clic.
      </p>
    </div>
  )
}

export default ForgotPasswordKiosk

