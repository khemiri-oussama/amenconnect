"use client"

import type React from "react"
import { useState } from "react"
import { IonIcon } from "@ionic/react"
import { idCardOutline } from "ionicons/icons"
import axios from "axios"

interface ForgotPasswordKioskProps {
  onBack: () => void
}

const ForgotPasswordKiosk: React.FC<ForgotPasswordKioskProps> = ({ onBack }) => {
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
      const response = await axios.post("/api/password/forgot-password", { cin: CIN })
      setSuccessMessage(
        response.data.message || "Un e-mail de réinitialisation a été envoyé à l'adresse associée à ce CIN."
      )
      setCIN("")
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="loginkiosk-subtitle">Réinitialisation du mot de passe</h2>
      <p className="loginkiosk-instruction">
        Entrez votre numéro CIN ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <form className="loginkiosk-form" onSubmit={handleSubmit}>
        <div className="loginkiosk-form-group">
          <label htmlFor="cin" className="loginkiosk-label">Numéro CIN</label>
          <div className="loginkiosk-input-container">
            <IonIcon icon={idCardOutline} className="loginkiosk-input-icon" />
            <input
              type="text"
              id="cin"
              className="loginkiosk-input"
              value={CIN}
              onChange={(e) => setCIN(e.target.value)}
              placeholder="Entrez votre numéro CIN"
              maxLength={8}
              minLength={8}
              required
            />
          </div>
        </div>

        {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p className="success-message" style={{ color: "green" }}>{successMessage}</p>}

        <button type="submit" className="loginkiosk-btn" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordKiosk
