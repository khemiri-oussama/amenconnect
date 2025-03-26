"use client"

import type React from "react"
import { useState } from "react"
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
} from "ionicons/icons"
import KioskLayout from "../components/KioskLayout"
import AnimatedCard from "../components/AnimatedCard"
import { useOrientation } from "../context/OrientationContext"
import "./login.css"

// Remove biometric login option from login page
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

