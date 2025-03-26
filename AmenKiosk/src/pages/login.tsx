"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonCheckbox,
  IonLabel,
  IonSpinner,
  IonAlert,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  arrowBackOutline,
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  shieldCheckmarkOutline,
  chevronForwardOutline,
  qrCodeOutline,
  swapHorizontalOutline,
  refreshOutline,
  phonePortraitOutline,
} from "ionicons/icons"
import KioskLayout from "../components/KioskLayout"
import AnimatedCard from "../components/AnimatedCard"
import { useOrientation } from "../context/OrientationContext"
import "./login.css"

const Login: React.FC = () => {
  const history = useHistory()
  const { isLandscape } = useOrientation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [authMethod, setAuthMethod] = useState<"qrcode" | "email">("qrcode")
  const [qrCodeExpiry, setQrCodeExpiry] = useState(120) // 2 minutes in seconds
  const [qrCodeRefreshing, setQrCodeRefreshing] = useState(false)

  // QR code expiry countdown
  useEffect(() => {
    if (authMethod !== "qrcode" || qrCodeExpiry <= 0) return

    const timer = setInterval(() => {
      setQrCodeExpiry((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [authMethod, qrCodeExpiry])

  // Format the countdown timer
  const formatCountdown = () => {
    const minutes = Math.floor(qrCodeExpiry / 60)
    const seconds = qrCodeExpiry % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Refresh QR code
  const refreshQrCode = () => {
    setQrCodeRefreshing(true)

    // Simulate QR code refresh
    setTimeout(() => {
      setQrCodeRefreshing(false)
      setQrCodeExpiry(120) // Reset to 2 minutes
    }, 1000)
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
    }, 1000)
  }

  const handleQrCodeLogin = () => {
    // Simulate QR code scan success
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setAlertMessage("Connexion par QR code réussie! Redirection vers votre tableau de bord...")
      setShowAlert(true)
    }, 1500)
  }

  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "qrcode" ? "email" : "qrcode")
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <KioskLayout pageTitle="Connexion">
          <div className={`login-container ${isLandscape ? "landscape" : "portrait"}`}>
            <AnimatedCard delay={100} className="login-card-main">
              <div className="login-content">
                <IonButton className="login-back-button" fill="clear" onClick={() => history.push("/home")}>
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  Retour
                </IonButton>

                <h2>Accédez à votre espace personnel</h2>

                {authMethod === "qrcode" ? (
                  <div className="login-qrcode-container">
                    <div className="login-qrcode-wrapper">
                      {qrCodeRefreshing ? (
                        <div className="login-qrcode-refreshing">
                          <IonSpinner name="circles" />
                          <p>Génération du QR code...</p>
                        </div>
                      ) : (
                        <>
                          <div className="login-qrcode-image">
                            <div className="login-qrcode-corners">
                              <div className="corner top-left"></div>
                              <div className="corner top-right"></div>
                              <div className="corner bottom-left"></div>
                              <div className="corner bottom-right"></div>
                            </div>
                            <IonIcon icon={qrCodeOutline} className="login-qrcode-placeholder" />
                          </div>
                          <div className="login-qrcode-expiry">
                            <div className="login-qrcode-timer">
                              <IonIcon icon={refreshOutline} />
                              <span>Expire dans {formatCountdown()}</span>
                            </div>
                            <IonButton
                              fill="clear"
                              size="small"
                              className="login-qrcode-refresh"
                              onClick={refreshQrCode}
                              disabled={qrCodeRefreshing}
                            >
                              Actualiser
                            </IonButton>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="login-qrcode-instructions">
                      <h3>Comment se connecter avec le QR code</h3>
                      <ol>
                        <li>
                          <div className="instruction-icon">
                            <IonIcon icon={phonePortraitOutline} />
                          </div>
                          <div className="instruction-text">Ouvrez l'application mobile AmenBank</div>
                        </li>
                        <li>
                          <div className="instruction-icon">
                            <IonIcon icon={qrCodeOutline} />
                          </div>
                          <div className="instruction-text">Appuyez sur "Scanner un QR code" dans le menu</div>
                        </li>
                        <li>
                          <div className="instruction-icon">
                            <IonIcon icon={chevronForwardOutline} />
                          </div>
                          <div className="instruction-text">Scannez le QR code affiché à l'écran</div>
                        </li>
                      </ol>
                    </div>

                    <div className="login-qrcode-actions">
                      <IonButton
                        className="login-qrcode-demo-button"
                        onClick={handleQrCodeLogin}
                        disabled={isLoading || qrCodeRefreshing}
                      >
                        {isLoading ? (
                          <IonSpinner name="circles" />
                        ) : (
                          <>
                            <span>Simuler une connexion réussie</span>
                            <IonIcon icon={chevronForwardOutline} slot="end" />
                          </>
                        )}
                      </IonButton>

                      <div className="login-auth-toggle">
                        <span>Préférez-vous vous connecter avec votre email?</span>
                        <IonButton fill="clear" className="login-toggle-button" onClick={toggleAuthMethod}>
                          <IonIcon icon={swapHorizontalOutline} slot="start" />
                          <span>Utiliser email et mot de passe</span>
                        </IonButton>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <form className="login-form" onSubmit={handleLogin}>
                      <div className="login-form-group">
                        <div className="login-input-container">
                          <IonIcon icon={mailOutline} className="login-input-icon" />
                          <IonItem className="login-input-item">
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

                        <div className="login-input-container">
                          <IonIcon icon={lockClosedOutline} className="login-input-icon" />
                          <IonItem className="login-input-item">
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
                          <div className="login-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                          </div>
                        </div>

                        <div className="login-options">
                          <div className="login-remember">
                            <IonCheckbox
                              checked={rememberMe}
                              onIonChange={(e) => setRememberMe(e.detail.checked)}
                              disabled={isLoading}
                            />
                            <IonLabel>Se souvenir de moi</IonLabel>
                          </div>
                          <a href="#" className="login-forgot">
                            Mot de passe oublié?
                          </a>
                        </div>

                        <IonButton className="login-submit-button" type="submit" expand="block" disabled={isLoading}>
                          {isLoading ? (
                            <IonSpinner name="circles" />
                          ) : (
                            <>
                              <span>Se connecter</span>
                              <IonIcon icon={chevronForwardOutline} slot="end" />
                            </>
                          )}
                        </IonButton>
                      </div>
                    </form>

                    <div className="login-auth-toggle">
                      <span>Préférez-vous vous connecter avec un QR code?</span>
                      <IonButton fill="clear" className="login-toggle-button" onClick={toggleAuthMethod}>
                        <IonIcon icon={swapHorizontalOutline} slot="start" />
                        <span>Utiliser le QR code</span>
                      </IonButton>
                    </div>
                  </>
                )}
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300} className="login-card-secondary">
              <div className="login-create-account">
                <h3>Nouveau sur AmenBank?</h3>
                <p>Créez votre compte en quelques étapes simples et accédez à tous nos services</p>
                <IonButton
                  className="login-create-button"
                  onClick={() => history.push("/account-creation")}
                  disabled={isLoading}
                >
                  <span>Créer un compte</span>
                  <IonIcon icon={chevronForwardOutline} slot="end" />
                </IonButton>
              </div>

              <div className="login-security-note">
                <IonIcon icon={shieldCheckmarkOutline} />
                <p>Votre connexion est sécurisée avec un cryptage SSL 256 bits</p>
              </div>
            </AnimatedCard>
          </div>
        </KioskLayout>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Information"
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  )
}

export default Login

