import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonIcon, IonLabel, IonRippleEffect } from "@ionic/react"
import {
  homeOutline,
  walletOutline,
  chatbubbleOutline,
  cardOutline,
  arrowForward,
  personOutline,
  statsChartOutline,
  eyeOutline,
  eyeOffOutline,
  notificationsOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./AccueilMobile.css"
import { UserMenu } from "./UserMenu"

const Accueil: React.FC = () => {
  const history = useHistory()
  const [showBalance, setShowBalance] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding custom-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div>
            <p className="greeting">Bonjour,</p>
            <h1 className="username">Foulen Ben Foulen</h1>
          </div>
          <div className="header-actions">
            <button className="notification-button ion-activatable" onClick={() => history.push("/notifications")}>
              <IonIcon icon={notificationsOutline} />
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
              <IonRippleEffect />
            </button>
            <button className="profile-button ion-activatable" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <IonIcon icon={personOutline} />
              <IonRippleEffect />
            </button>
            <UserMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>

        {/* Account Card */}
        <div className="account-card ion-activatable">
          <div className="account-header">
            <h2>Compte Epargne</h2>
            <IonIcon icon={statsChartOutline} className="stats-icon" onClick={() => history.push("/compte")} />
          </div>
          <div className="account-details">
            <div>
              <div className="balance-container">
                <p className="balance">{showBalance ? "0.000 TND" : "••••• TND"}</p>
                <button className="toggle-balance" onClick={toggleBalance}>
                  <IonIcon icon={showBalance ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
              <p className="account-number">12345678987</p>
            </div>
            <p className="expiry-date">20/01/2025</p>
          </div>
          <IonRippleEffect />
        </div>

        {/* Cards Section */}
        <div className="section">
          <div className="section-header">
            <h2>Cartes</h2>
            <button className="view-all ion-activatable" onClick={() => history.push("/carte")}>
              Afficher tout
              <IonRippleEffect />
            </button>
          </div>
          <div className="payment-card ion-activatable" onClick={() => history.push("/carte")}>
            <p className="card-label">Carte de paiement</p>
            <div className="card-details">
              <IonIcon icon={cardOutline} className="card-icon" />
              <div className="card-info">
                <p className="card-name">EL AMEN WHITE EMV</p>
                <p className="card-number">1234 •••• •••• 1234</p>
              </div>
              <p className="card-expiry">01/28</p>
            </div>
            <IonRippleEffect />
          </div>
        </div>

        {/* Budget Section */}
        <div className="section">
          <div className="section-header">
            <h2>Budget</h2>
            <button className="view-all ion-activatable" onClick={() => history.push("/budget")}>
              Afficher tout
              <IonRippleEffect />
            </button>
          </div>
          <div className="budget-card ion-activatable">
            <h3>Dépenses ce mois</h3>
            <div className="budget-progress">
              <div className="progress-bar" style={{ width: "70%" }}></div>
            </div>
            <div className="budget-details">
              <p>1,400 TND / 2,000 TND</p>
              <p className="budget-remaining">Reste: 600 TND</p>
            </div>
            <IonRippleEffect />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-tabs">
          <button className="tab-button active ion-activatable">
            <IonIcon icon={homeOutline} />
            <IonLabel>Accueil</IonLabel>
            <IonRippleEffect />
          </button>
          <button className="tab-button ion-activatable" onClick={() => history.push("/compte")}>
            <IonIcon icon={walletOutline} />
            <IonLabel>Compte</IonLabel>
            <IonRippleEffect />
          </button>
          <button className="tab-button ion-activatable" onClick={() => history.push("/ChatBot")}>
            <IonIcon icon={chatbubbleOutline} />
            <IonLabel>Chat</IonLabel>
            <IonRippleEffect />
          </button>
          <button className="tab-button ion-activatable" onClick={() => history.push("/Carte")}>
            <IonIcon icon={cardOutline} />
            <IonLabel>Carte</IonLabel>
            <IonRippleEffect />
          </button>
          <button className="tab-button ion-activatable">
            <IonIcon icon={arrowForward} />
            <IonLabel>Virements</IonLabel>
            <IonRippleEffect />
          </button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Accueil

