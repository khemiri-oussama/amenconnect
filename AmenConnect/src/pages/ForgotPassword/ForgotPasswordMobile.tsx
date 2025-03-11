"use client"

import type React from "react"
import { IonInput, IonButton, IonText, IonLabel, IonImg } from "@ionic/react"
import { useState } from "react"
import axios from "axios"
import "./ForgotPasswordMobile.css"
import { useHistory } from "react-router-dom"

interface ForgotPasswordMobileProps {
  onNavigateToLogin?: () => void
  apiEndpoint?: string
  logoSrc?: string
  successCallback?: (response: any) => void
}

export default function ForgotPasswordMobile({
  onNavigateToLogin,
  apiEndpoint = "/api/password/forgot-password",
  logoSrc = "../amen_logo.png",
  successCallback,
}: ForgotPasswordMobileProps) {
  const [cin, setCin] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Move useHistory hook inside the component.
  const history = useHistory()

  // Define a default onNavigateToLogin handler if none is provided.
  const handleNavigateToLogin = onNavigateToLogin || (() => history.push("/login"))

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(true)

    // CIN validation
    if (!cin.trim() || cin.length !== 8 || !/^\d+$/.test(cin)) {
      setErrorMessage("Veuillez saisir un numéro CIN valide à 8 chiffres.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(apiEndpoint, { cin })
      const message =
        response.data.message ||
        "Un e-mail de réinitialisation a été envoyé à l'adresse associée à ce CIN."
      setSuccessMessage(message)

      if (successCallback) {
        successCallback(response)
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Erreur inattendue.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-password-mobile-container">
      <div className="mobile-content-wrapper">
        <div className="mobile-logo-container">
          <IonImg src={logoSrc} alt="Logo" className="mobile-logo" />
        </div>

        <div className="mobile-form-container">
          <h1 className="mobile-title">Mot de passe oublié</h1>
          <p className="mobile-subtitle">
            Entrez votre numéro CIN pour réinitialiser votre mot de passe
          </p>

          <form onSubmit={handleForgotPassword} className="mobile-forgot-form">
            <div className="mobile-input-group">
              <IonLabel className="mobile-input-label">Numéro CIN</IonLabel>
              <IonInput
                type="text"
                value={cin}
                onIonChange={(e) => setCin(e.detail.value!)}
                className="mobile-custom-input"
                maxlength={8}
                minlength={8}
                required
              />
            </div>

            {errorMessage && (
              <IonText color="danger" className="mobile-error-message">
                {errorMessage}
              </IonText>
            )}

            {successMessage && (
              <IonText color="success" className="mobile-success-message">
                {successMessage}
              </IonText>
            )}

            <IonButton
              expand="block"
              type="submit"
              className="mobile-forgot-button"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
            </IonButton>

            <IonText
              className="mobile-back-to-login"
              onClick={handleNavigateToLogin}
            >
              <a style={{ cursor: "pointer" }}>Retour à la connexion</a>
            </IonText>
          </form>
        </div>
      </div>
      <div className="mobile-background-effect"></div>
    </div>
  )
}
