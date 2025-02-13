import { IonContent, IonPage, IonInput, IonButton, IonText, IonLabel, IonImg } from "@ionic/react"
import { useState } from "react"
import { useHistory } from "react-router-dom"

import "./LoginDesktop.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const history = useHistory()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", email)
    history.push("/otp")
  }

  return (
    <IonPage>
      <IonContent className="ion-padding login-container" fullscreen>
        <div className="content-wrapper">
          <div className="login-box">
            <div className="logo-container-accueil-desktop">
              <IonImg src="../amen_logo.png" alt="Logo" className="logo-accueil-desktop" />
            </div>
            <div className="form-container">
              <h1 className="title-accueil-desktop">Bienvenu</h1>
              <p className="subtitle">Veuillez saisir les détails de votre compte</p>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <IonLabel className="input-label">Identifiant</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    className="custom-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <IonLabel className="input-label">Mot De Passe</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    className="custom-input"
                    required
                  />
                </div>

                <IonText className="forgot-password">
                  <a href="/forgot-password">Mot De Passe oublier ?</a>
                </IonText>

                <IonButton expand="block" type="submit" className="login-button">
                  Se Connecter
                </IonButton>
              </form>
            </div>
          </div>
        </div>
        <div className="blurry-div"></div>
      </IonContent>
    </IonPage>
  )
}

