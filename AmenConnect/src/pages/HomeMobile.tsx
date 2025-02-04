import type { FC } from "react"
import { IonContent, IonPage, IonButton, IonImg } from "@ionic/react"
import { useHistory } from "react-router-dom"
import "./HomeMobile.css"

const HomeMobile: FC = () => {
  const history = useHistory()

  const handleLogin = () => {
    history.push("/login")
  }

  const handleGuestMode = () => {
    // Implement guest mode logic here
    console.log("Entering guest mode")
  }

  return (
    <IonPage className="home-mobile-page">
      <IonContent className="ion-padding home-mobile-container" fullscreen>
        <div className="home-mobile-content-wrapper">
          <div className="home-mobile-logo-container">
            <IonImg src="../amen_logo.png" alt="Logo" className="home-mobile-logo" />
          </div>
          <div className="home-mobile-welcome-container">
            <h1 className="home-mobile-title">Bienvenue</h1>
            <p className="home-mobile-subtitle">Choisissez votre mode d'accès</p>
          </div>
          <div className="home-mobile-buttons-container">
            <IonButton expand="block" className="home-mobile-login-button" onClick={handleLogin}>
              Se Connecter
            </IonButton>
            <IonButton expand="block" className="home-mobile-guest-button" onClick={handleGuestMode}>
              Mode Invité
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomeMobile

