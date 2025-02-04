import type React from "react"
import { IonContent, IonPage, IonButton, IonImg, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { logInOutline, personOutline, helpCircleOutline, languageOutline } from "ionicons/icons"
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
      <IonContent className="home-desktop-container" fullscreen>
        {/* Background Elements */}
        <div className="home-desktop-background">
          <div className="home-desktop-gradient-1"></div>
          <div className="home-desktop-gradient-2"></div>
          <div className="home-desktop-grid"></div>
        </div>

        {/* Main Content */}
        <div className="home-desktop-content">
          <header className="home-desktop-header">
            <IonImg src="amen_logo.png" alt="Amen Bank Logo" className="home-desktop-logo-image" />
            <nav className="home-desktop-nav">
              <IonButton fill="clear" className="home-desktop-nav-button">
                <IonIcon icon={helpCircleOutline} slot="start" />
                Aide
              </IonButton>
              <IonButton fill="clear" className="home-desktop-nav-button">
                <IonIcon icon={languageOutline} slot="start" />
                Français
              </IonButton>
            </nav>
          </header>

          <main className="home-desktop-main">
            <div className="home-desktop-text">
              <h1 className="home-desktop-title">Bienvenue chez Amen Bank</h1>
              <p className="home-desktop-subtitle">Votre partenaire financier de confiance</p>
            </div>
            <div className="home-desktop-buttons">
              <IonButton expand="block" className="home-desktop-connect-button" onClick={handleLogin}>
                <IonIcon icon={logInOutline} slot="start" />
                Se Connecter
              </IonButton>
              <IonButton expand="block" className="home-desktop-guest-button" onClick={handleGuestMode}>
                <IonIcon icon={personOutline} slot="start" />
                Mode Invité
              </IonButton>
            </div>
          </main>

          <footer className="home-desktop-footer">
            <div className="home-desktop-features">
              <div className="home-desktop-feature">
                <IonIcon icon={helpCircleOutline} className="home-desktop-feature-icon" />
                <h3>Support 24/7</h3>
                <p>Assistance disponible à tout moment</p>
              </div>
              <div className="home-desktop-feature">
                <IonIcon icon={languageOutline} className="home-desktop-feature-icon" />
                <h3>Multi-langues</h3>
                <p>Services disponibles en plusieurs langues</p>
              </div>
            </div>
            <p className="home-desktop-copyright">© 2025 Amen Bank. Tous droits réservés.</p>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default HomeDesktop

