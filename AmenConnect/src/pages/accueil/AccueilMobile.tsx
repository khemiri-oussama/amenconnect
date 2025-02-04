import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonIcon, IonRippleEffect } from "@ionic/react"
import {
  statsChartOutline,
  eyeOutline,
  eyeOffOutline,
  notificationsOutline,
  personOutline,
  cardOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./AccueilMobile.css"
import NavMobile from "../../components/NavMobile"

const AccueilMobile: React.FC = () => {
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
        <div className="content-wrapper">
          {/* Profile Header */}
          <div className="profile-header">
            <div>
              <p className="greeting">Bonjour,</p>
              <h1 className="username">Foulen Ben Foulen</h1>
            </div>
            <div className="header-actions">
              <button className="notification-button ion-activatable">
                <IonIcon icon={notificationsOutline} />
                {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
                <IonRippleEffect />
              </button>
              <button className="profile-button ion-activatable" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <IonIcon icon={personOutline} />
                <IonRippleEffect />
              </button>
            </div>
          </div>

          {/* Account Card */}
          <div className="account-card">
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
        </div>
      </IonContent>
      <NavMobile currentPage="accueil" />
    </IonPage>
  )
}

export default AccueilMobile