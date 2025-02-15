import type React from "react"
import { useState,useEffect } from "react"
import { IonContent, IonPage, IonIcon, IonRippleEffect, IonButton } from "@ionic/react"
import {
  cardOutline,
  personOutline,
  statsChartOutline,
  eyeOutline,
  eyeOffOutline,
  notificationsOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./AccueilMobile.css"
import { UserMenu } from "./MenuMobile/UserMenu"
import NavMobile from "../../../components/NavMobile"

const AccueilMobile: React.FC = () => {
  const history = useHistory()
  const [showBalance, setShowBalance] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [today, setToday] = useState<string>('');

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR'); // Format as desired
    setToday(formattedDate);
  }, []);
  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="custom-content-mobile" scrollY={true} forceOverscroll={true}>
        <div className="safe-area-padding">
          {/* Profile Header */}
          <div className="profile-header-mobile">
            <div>
              <p className="greeting-mobile">Bonjour,</p>
              <h1 className="username-mobile">Foulen Ben Foulen</h1>
            </div>
            <div className="header-actions-mobile">
              <IonButton
                fill="clear"
                className="notification-button-mobile ion-activatable"
                onClick={() => history.push("/notifications")}
              >
                <IonIcon icon={notificationsOutline} />
                {notificationCount > 0 && <span className="notification-badge-mobile">{notificationCount}</span>}
                <IonRippleEffect />
              </IonButton>
              <IonButton
                fill="clear"
                className="profile-button-mobile ion-activatable"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <IonIcon icon={personOutline} />
                <IonRippleEffect />
              </IonButton>
              <UserMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            </div>
          </div>

          {/* Account Card */}
          <div className="account-card-mobile ion-activatable">
            <div className="account-header-mobile">
              <h2>Compte Epargne</h2>
              <IonIcon icon={statsChartOutline} className="stats-icon-mobile" onClick={() => history.push("/compte")} />
            </div>
            <div className="account-details-mobile">
              <div>
                <div className="balance-container-mobile">
                  <p className="balance-mobile">{showBalance ? "450.0 TND" : "••••• TND"}</p>
                  <IonButton fill="clear" className="toggle-balance-mobile" onClick={toggleBalance}>
                    <IonIcon icon={showBalance ? eyeOffOutline : eyeOutline} />
                  </IonButton>
                </div>
                <p className="account-number-mobile">12345678987</p>
              </div>
              <p className="expiry-date-mobile">{today}</p>
            </div>
            <IonRippleEffect />
          </div>

          {/* Cards Section */}
          <div className="section-mobile">
            <div className="section-header-mobile">
              <h2>Cartes</h2>
              <IonButton
                fill="clear"
                className="view-all-mobile ion-activatable"
                onClick={() => history.push("/carte")}
              >
                Afficher tout
                <IonRippleEffect />
              </IonButton>
            </div>
            <div className="payment-card-mobile ion-activatable" onClick={() => history.push("/carte")}>
              <p className="card-label-mobile">Carte de paiement</p>
              <div className="card-details-mobile">
                <IonIcon icon={cardOutline} className="card-icon-mobile" />
                <div className="card-info-mobile">
                  <p className="card-name-mobile">EL AMEN WHITE EMV</p>
                  <p className="card-number-mobile">1234 •••• •••• 1234</p>
                </div>
                <p className="card-expiry-mobile">01/28</p>
              </div>
              <IonRippleEffect />
            </div>
          </div>

          {/* Budget Section */}
          <div className="section-mobile">
            <div className="section-header-mobile">
              <h2>Budget</h2>
              <IonButton
                fill="clear"
                className="view-all-mobile ion-activatable"
                onClick={() => history.push("/budget")}
              >
                Afficher tout
                <IonRippleEffect />
              </IonButton>
            </div>
            <div className="budget-card-mobile ion-activatable">
              <h3>Dépenses ce mois</h3>
              <div className="budget-progress-mobile">
                <div className="progress-bar-mobile" style={{ width: "70%" }}></div>
              </div>
              <div className="budget-details-mobile">
                <p>1,400 TND / 2,000 TND</p>
                <p className="budget-remaining-mobile">Reste: 600 TND</p>
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

