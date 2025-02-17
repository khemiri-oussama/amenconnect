import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonLabel,
  IonImg,
  IonIcon,
  IonRippleEffect,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline } from "ionicons/icons"
import axios from "axios"
import { useAuth } from "../../AuthContext"
import "./LoginMobile.css"

const LoginMobile: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const { setIsAuthenticated } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await axios.post("/api/auth/login", { email, password })
      console.log("Login response:", response.data)

      const user = response.data.user
      if (!user) throw new Error("No user data returned from API")

      localStorage.setItem("user", JSON.stringify(user))
      setIsAuthenticated(true)

      console.log("Redirecting to /otp with user:", user)
      history.push("/otp", { user })
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message)
      } else {
        setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonContent className="login-mobile-container" fullscreen>
        <div className="login-mobile-content">
          <div className="login-mobile-logo-container">
            <IonImg src="../amen_logo.png" alt="Logo" className="login-mobile-logo" />
          </div>
          <div className="login-mobile-form-container">
            <h1 className="login-mobile-title">Bienvenue</h1>
            <p className="login-mobile-subtitle">Veuillez saisir les détails de votre compte</p>

            <form onSubmit={handleLogin} className="login-mobile-form">
              <div className="login-mobile-input-group">
                <IonLabel className="login-mobile-input-label">Identifiant</IonLabel>
                <div className="login-mobile-input-wrapper">
                  <IonIcon icon={mailOutline} className="login-mobile-input-icon" />
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    className="login-mobile-input"
                    required
                    placeholder="Entrez votre email"
                  />
                </div>
              </div>

              <div className="login-mobile-input-group">
                <IonLabel className="login-mobile-input-label">Mot De Passe</IonLabel>
                <div className="login-mobile-input-wrapper">
                  <IonIcon icon={lockClosedOutline} className="login-mobile-input-icon" />
                  <IonInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    className="login-mobile-input"
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                  <IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    className="login-mobile-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                </div>
              </div>

              {errorMessage && (
                <IonText color="danger" className="error-message">
                  {errorMessage}
                </IonText>
              )}

              <IonText className="login-mobile-forgot-password">
                <a href="/forgot-password">Mot De Passe oublié ?</a>
              </IonText>

              <IonButton expand="block" type="submit" className="login-mobile-button ion-activatable" disabled={isLoading}>
                {isLoading ? "Chargement..." : "Se Connecter"}
                <IonRippleEffect />
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default LoginMobile
