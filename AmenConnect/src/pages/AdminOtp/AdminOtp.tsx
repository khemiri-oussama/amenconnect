"use client"

import type React from "react"
import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg, IonIcon } from "@ionic/react"
import { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import { lockClosed } from "ionicons/icons"
import "./../AdminLogin/AdminLogin.css" // Reusing the same CSS

export default function AdminOtp() {
  const [otp, setOtp] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes countdown
  const history = useHistory()
  const timerRef = useRef<NodeJS.Timeout>()

  // Timer countdown effect with useRef to prevent re-renders affecting the OTP input
  useEffect(() => {
    if (timeLeft <= 0) return

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setErrorMessage("Veuillez entrer un code à 6 chiffres")
      return
    }

    setIsLoading(true)

    try {
      // Replace with your actual OTP verification logic
      // await verifyAdminOtp(otp)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // If successful, redirect to admin dashboard
      history.push("/Dashboard")
    } catch (error) {
      setErrorMessage("Code de vérification incorrect. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)

    try {
      // Replace with your actual resend OTP logic
      // await resendAdminOtp()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset timer
      setTimeLeft(120)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Erreur lors de l'envoi du code. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP input change with a separate function to ensure value is preserved
  const handleOtpChange = (value: string) => {
    // Only allow numeric input and max 6 digits
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6)
    setOtp(numericValue)
  }

  return (
    <IonPage>
      <IonContent className="admin-login-container" fullscreen>
        <div className="admin-layout">
          <div className="admin-sidebar">
            <div className="admin-logo-container">
              <IonImg src="../amen_logo.png" alt="Logo" className="admin-logo" />
            </div>
            <div className="admin-sidebar-content">
              <h2 className="admin-sidebar-title">Vérification</h2>
              <p className="admin-sidebar-text">Sécurité renforcée pour l'accès à l'administration</p>
            </div>
          </div>

          <div className="admin-form-section">
            <div className="admin-form-container">
              <h1 className="admin-title">Authentification à deux facteurs</h1>
              <p className="admin-subtitle">Veuillez saisir le code de vérification envoyé à votre appareil</p>

              <form onSubmit={handleVerifyOtp} className="admin-login-form">
                <div className="admin-input-group">
                  <IonLabel className="admin-input-label">Code de vérification</IonLabel>
                  <div className="admin-input-wrapper">
                    <IonIcon icon={lockClosed} className="admin-input-icon" />
                    <IonInput
                      type="text"
                      inputMode="numeric"
                      maxlength={6}
                      value={otp}
                      onIonChange={(e) => handleOtpChange(e.detail.value!)}
                      className="admin-input"
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <IonText color="danger" className="admin-error-message">
                    {errorMessage}
                  </IonText>
                )}

                <div className="admin-otp-timer">
                  <IonText color={timeLeft <= 30 ? "danger" : "medium"}>
                    {timeLeft > 0
                      ? `Expire dans: ${formatTime(timeLeft)}`
                      : "Code expiré. Veuillez demander un nouveau code."}
                  </IonText>
                </div>

                <div className="admin-actions">
                  <IonButton
                    expand="block"
                    type="submit"
                    className="admin-login-button"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Vérification..." : "Vérifier"}
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    className="admin-resend-button"
                    disabled={isLoading || timeLeft > 0}
                    onClick={handleResendOtp}
                  >
                    Renvoyer le code
                  </IonButton>
                </div>

                <div className="admin-back-link">
                  <a onClick={() => history.push("/admin/login")} style={{ cursor: "pointer" }}>
                    Retour à la page de connexion
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

