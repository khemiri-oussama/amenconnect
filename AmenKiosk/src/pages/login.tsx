"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonRippleEffect,
  IonSpinner,
  IonAlert,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  timeOutline,
  arrowBackOutline,
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  fingerPrintOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons"
import "./login.css"

const Login: React.FC = () => {
  const history = useHistory()
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [useBiometric, setUseBiometric] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Update time every 30 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)

    // Add entrance animation class after component mounts
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(timeInterval)
      clearTimeout(timer)
    }
  }, [])

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setAlertMessage("Veuillez remplir tous les champs requis.")
      setShowAlert(true)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, accept any email with a password longer than 5 chars
      if (password.length > 5) {
        // Success - redirect to a dashboard (not implemented yet)
        setAlertMessage("Connexion réussie! Redirection vers votre tableau de bord...")
        setShowAlert(true)
      } else {
        // Failure
        setAlertMessage("Identifiants incorrects. Veuillez réessayer.")
        setShowAlert(true)
      }
    }, 1500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleBiometricLogin = () => {
    setUseBiometric(true)

    // Simulate biometric authentication
    setTimeout(() => {
      setUseBiometric(false)
      setAlertMessage("Authentification biométrique réussie! Redirection vers votre tableau de bord...")
      setShowAlert(true)
    }, 2000)
  }

  const handleBack = () => {
    setPageLoaded(false)

    setTimeout(() => {
      history.push("/home")
    }, 300)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-0">
        <div className="app-container">
          <div className="background-pattern"></div>

          <div className="top-section">
            <div className="date-time">
              <IonIcon icon={timeOutline} />
              <span>{formatDate(currentTime)}</span>
            </div>

            <div className="logo-container">
              <div className="bank-logo">
                <IonImg src="amen_logo.png" alt="AmenBank Logo" />
              </div>
            </div>
          </div>

          <div className="login-content">
            <div className={`login-card ${pageLoaded ? "show-card" : "hide-card"}`}>
              <div className="page-header">
                <IonButton className="back-button-top" fill="clear" onClick={handleBack}>
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Retour
                </IonButton>
                <h1 className="page-title">Connexion</h1>
                <div className="title-accent"></div>
                <p className="page-subtitle">Accédez à votre espace personnel</p>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <div className="input-icon">
                    <IonIcon icon={mailOutline} />
                  </div>
                  <IonItem className="form-item">
                    <IonInput
                      type="email"
                      label="Email"
                      labelPlacement="floating"
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value || "")}
                      required
                      disabled={isLoading}
                    />
                  </IonItem>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <IonIcon icon={lockClosedOutline} />
                  </div>
                  <IonItem className="form-item">
                    <IonInput
                      type={showPassword ? "text" : "password"}
                      label="Mot de passe"
                      labelPlacement="floating"
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value || "")}
                      required
                      disabled={isLoading}
                    />
                  </IonItem>
                  <div className="password-toggle" onClick={togglePasswordVisibility}>
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </div>
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <IonCheckbox
                      checked={rememberMe}
                      onIonChange={(e) => setRememberMe(e.detail.checked)}
                      disabled={isLoading}
                    />
                    <IonLabel>Se souvenir de moi</IonLabel>
                  </div>
                  <a href="#" className="forgot-password">
                    Mot de passe oublié?
                  </a>
                </div>

                <IonButton className="login-button" type="submit" expand="block" disabled={isLoading}>
                  {isLoading ? <IonSpinner name="crescent" /> : "Se connecter"}
                  <IonRippleEffect />
                </IonButton>
              </form>

              <div className="biometric-login">
                <p>Ou connectez-vous avec</p>
                <IonButton
                  className="biometric-button"
                  fill="clear"
                  onClick={handleBiometricLogin}
                  disabled={isLoading || useBiometric}
                >
                  {useBiometric ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon icon={fingerPrintOutline} />
                      <span>Empreinte digitale</span>
                    </>
                  )}
                </IonButton>
              </div>

              <div className="create-account">
                <p>Vous n'avez pas de compte?</p>
                <IonButton
                  className="create-account-button"
                  fill="outline"
                  onClick={() => history.push("/account-creation")}
                  disabled={isLoading}
                >
                  Créer un compte
                  <IonRippleEffect />
                </IonButton>
              </div>
            </div>

            <div className={`security-note ${pageLoaded ? "show-note" : ""}`}>
              <div className="security-icon">
                <IonIcon icon={shieldCheckmarkOutline} />
              </div>
              <p>Votre connexion est sécurisée avec un cryptage SSL 256 bits</p>
            </div>
          </div>

          <footer className="app-footer">
            <div className="footer-content">© 2024 AmenBank. Tous droits réservés.</div>
          </footer>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Information"
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  )
}

export default Login

