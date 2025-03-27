"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { IonContent, IonPage, IonImg, useIonRouter, IonIcon } from "@ionic/react"
import { arrowBack, eyeOutline, eyeOffOutline, phonePortrait, mailOutline, lockClosedOutline } from "ionicons/icons"
import { QRCodeSVG } from "qrcode.react"
import { useLogin } from "../../hooks/useLogin"
import ForgotPasswordKiosk from "./ForgotPassword/ForgotPassword"
import "./login.css"

const LoginKiosk: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const ionRouter = useIonRouter()

  // Ref for managing inactivity timer
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  // Ref to focus on the username input when the form is shown
  const usernameInputRef = useRef<HTMLInputElement | null>(null)

  // Generate a unique session ID for the QR code when the component loads
  const sessionId = useRef(Math.random().toString(36).substring(2, 15))

  // Create a QR session in the database
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch("/api/qr-login/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId: sessionId.current }),
        })
        if (!response.ok) {
          console.error("Failed to create QR session")
        }
      } catch (err) {
        console.error("Error creating QR session:", err)
      }
    }
    createSession()
  }, [])

  // Reset inactivity timer (session timeout)
  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      ionRouter.push("/home")
    }, 60000)
  }, [ionRouter])

  const handleUserInteraction = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Use the useLogin hook for email/password login
  const { isLoading, errorMessage, login } = useLogin()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
    } catch (error) {
      // Error is already handled by the hook
      console.error("Login failed:", error)
    }
    resetTimer()
  }

  const handleBack = () => {
    if (showForgotPassword) {
      setShowForgotPassword(false)
      setShowLoginForm(true)
    } else if (showLoginForm) {
      setShowLoginForm(false)
    } else {
      ionRouter.push("/home")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const showIdentifierLogin = () => {
    setShowLoginForm(true)
    setShowForgotPassword(false)
    resetTimer()
  }

  const showForgotPasswordForm = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowForgotPassword(true)
    setShowLoginForm(false)
    resetTimer()
  }

  const handleForgotPasswordSubmit = async (email: string) => {
    try {
      const response = await fetch("/api/password/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Une erreur s'est produite")
      }

      // Success - the email was sent
      return
    } catch (error: any) {
      throw error
    }
  }

  // Embed the session ID in the QR code URL for the mobile app to scan
  const qrCodeData = `http://localhost:8200/auth?session=${sessionId.current}`

  // Polling: periodically check if the mobile app has authenticated the session.
  // When authenticated, redirect the kiosk to /accueil.
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/qr-login/${sessionId.current}?t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.status === "authenticated") {
            console.log("Session authenticated, redirecting to accueil...")
            clearInterval(intervalId)
            window.location.href = "/accueil"
          }
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 3000)
    return () => clearInterval(intervalId)
  }, [ionRouter])

  useEffect(() => {
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("click", handleUserInteraction)

    if (showLoginForm && usernameInputRef.current) {
      usernameInputRef.current.focus()
    }

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [handleUserInteraction, showLoginForm])

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="loginkiosk-container">
          <div className="loginkiosk-bg-circle-1"></div>
          <div className="loginkiosk-bg-circle-2"></div>
          <div className="loginkiosk-bg-blob"></div>

          <div className="loginkiosk-content">
            <div className="loginkiosk-back-button" onClick={handleBack}>
              <IonIcon icon={arrowBack} />
              <span>Retour</span>
            </div>
            {!showForgotPassword ? (
              <>
                <div className="loginkiosk-logo">
                  <IonImg src="favicon.png" alt="Amen Bank Logo" className="loginkiosk-img" />
                </div>
                <h1 className="loginkiosk-title">Connexion</h1>
                {!showLoginForm ? (
                  <div className="loginkiosk-qr-section animate-fade-in">
                    <div className="loginkiosk-qr-container">
                      <div className="loginkiosk-qr-instructions">
                        <IonIcon icon={phonePortrait} className="loginkiosk-qr-icon" />
                        <p>Scannez ce code QR avec votre application mobile</p>
                      </div>
                      <div className="loginkiosk-qr-code">
                        <QRCodeSVG
                          value={qrCodeData}
                          size={280}
                          level="H"
                          includeMargin={true}
                          bgColor="#ffffff"
                          fgColor="#121660"
                        />
                      </div>
                      <button onClick={showIdentifierLogin} className="loginkiosk-alt-login">
                        Continuez avec identifiant
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="loginkiosk-form animate-fade-in" onSubmit={handleLogin}>
                    <div className="kiosk-form-group">
                      <label htmlFor="username" className="kiosk-label">
                        Identifiant
                      </label>
                      <div className="loginkiosk-input-container">
                        <IonIcon icon={mailOutline} className="loginkiosk-input-icon" />
                        <input
                          ref={usernameInputRef}
                          type="text"
                          id="username"
                          className="kiosk-input"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Entrez votre identifiant"
                          required
                        />
                      </div>
                    </div>
                    <div className="kiosk-form-group">
                      <label htmlFor="password" className="kiosk-label">
                        Mot de passe
                      </label>
                      <div className="loginkiosk-password-container">
                        <IonIcon icon={lockClosedOutline} className="loginkiosk-input-icon" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="kiosk-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe"
                          required
                        />
                        <div className="loginkiosk-password-toggle" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                        </div>
                      </div>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="kiosk-btn" disabled={isLoading}>
                      {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                    <div className="loginkiosk-forgot-password">
                      <a href="#" onClick={showForgotPasswordForm}>
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </form>
                )}
                <p className="loginkiosk-message">
                  La réussite est à
                  <br />
                  portée de clic.
                </p>
              </>
            ) : (
              <ForgotPasswordKiosk onBack={handleBack} onSubmit={handleForgotPasswordSubmit} />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoginKiosk

