import type React from "react"
import { IonContent, IonPage, IonButton, IonImg, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { logInOutline, personOutline } from "ionicons/icons"
import "./HomeDesktop.css"

const HomeDesktop: React.FC = () => {
  const history = useHistory()

  const handleLogin = () => {
    history.push("/login")
  }

  const handleGuestMode = () => {
    // Implement guest mode logic here
  }

  return (
    <IonPage>
      <IonContent className="ion-padding home-container" fullscreen>
        <div className="content-wrapper">
          <div className="left-section">
            <div className="logo-container">
              <IonImg src="../amen_logo.png" alt="Logo" className="logo" />
            </div>
          </div>
          <div className="right-section">
            <div className="welcome-container">
              <h1 className="title">Bienvenue</h1>
              <p className="subtitle">Choisissez votre mode d'accès</p>
            </div>
            <div className="buttons-container">
              <IonButton expand="block" className="login-button" onClick={handleLogin}>
                <IonIcon icon={logInOutline} slot="start" />
                Se Connecter
              </IonButton>
              <IonButton expand="block" className="guest-button" onClick={handleGuestMode}>
                <IonIcon icon={personOutline} slot="start" />
                Mode Invité
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomeDesktop

