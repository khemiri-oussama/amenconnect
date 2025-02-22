//accueil/AccueilMobile.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonRippleEffect,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react"
import {
  cardOutline,
  personOutline,
  statsChartOutline,
  eyeOutline,
  eyeOffOutline,
  notificationsOutline,
  chevronDownCircleOutline,
  walletOutline,
  arrowForwardOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./AccueilMobile.css"
import { UserMenu } from "./MenuMobile/UserMenu"
import NavMobile from "../../../components/NavMobile"
import { useAuth } from "../../../AuthContext"

const AccueilMobile: React.FC = () => {
  const history = useHistory()
  // Get the full profile and authLoading flag from the context
  const { profile, authLoading } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [today, setToday] = useState<string>("")

  useEffect(() => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setToday(formattedDate)
  }, [])

  if (authLoading) {
    return <div>Loading...</div>
  }

  // Retrieve the first account from profile, if available.
  const account =
    profile && profile.comptes && profile.comptes.length > 0
      ? profile.comptes[0]
      : null

  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      // Add refresh logic here
      event.detail.complete()
    }, 2000)
  }

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="custom-content-mobile"
        scrollY={true}
        forceOverscroll={true}
      >
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Tirer pour rafraîchir"
            refreshingSpinner="circles"
            refreshingText="Mise à jour..."
          ></IonRefresherContent>
        </IonRefresher>
        <div className="safe-area-padding">
          <div className="content-wrapper-mobile">
            {/* Profile Header */}
            <div className="profile-header-mobile">
              <div className="profile-info">
                <p className="greeting-mobile">Bonjour,</p>
                <h1 className="username-mobile">
                  {profile?.user.prenom || "Utilisateur"}{" "}
                  {profile?.user.nom || ""}
                </h1>
              </div>
              <div className="header-actions-mobile">
                <IonButton
                  fill="clear"
                  className="notification-button-mobile ion-activatable"
                  onClick={() => history.push("/notifications")}
                >
                  <IonIcon icon={notificationsOutline} />
                  {notificationCount > 0 && (
                    <span className="notification-badge-mobile">
                      {notificationCount}
                    </span>
                  )}
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
            <div
              className="account-card-mobile ion-activatable"
              onClick={() => history.push("/compte")}
            >
              <div className="account-header-mobile">
                <h2>{account ? account.type : "Compte Epargne"}</h2>
                <IonIcon icon={statsChartOutline} className="stats-icon-mobile" />
              </div>
              <div className="account-details-mobile">
                <div>
                  <div className="balance-container-mobile">
                    <p className="balance-mobile">
                      {showBalance
                        ? account
                          ? `${account.solde} TND`
                          : "450.0 TND"
                        : "••••• TND"}
                    </p>
                    <IonButton
                      fill="clear"
                      className="toggle-balance-mobile"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBalance()
                      }}
                    >
                      <IonIcon icon={showBalance ? eyeOffOutline : eyeOutline} />
                    </IonButton>
                  </div>
                  <p className="account-number-mobile">
                    {account ? account.numéroCompte : "12345678987"}
                  </p>
                </div>
                <p className="expiry-date-mobile">{today}</p>
              </div>
              <IonRippleEffect />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-mobile">
              <IonButton
                className="quick-action-button"
                onClick={() => history.push("/virement")}
              >
                <IonIcon icon={walletOutline} />
                <span>Virement</span>
              </IonButton>
              <IonButton
                className="quick-action-button"
                onClick={() => history.push("/paiement")}
              >
                <IonIcon icon={cardOutline} />
                <span>Paiement</span>
              </IonButton>
              <IonButton
                className="quick-action-button"
                onClick={() => history.push("/budget")}
              >
                <IonIcon icon={statsChartOutline} />
                <span>Budget</span>
              </IonButton>
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
                  <IonIcon icon={arrowForwardOutline} />
                  <IonRippleEffect />
                </IonButton>
              </div>
              <div
                className="payment-card-mobile ion-activatable"
                onClick={() => history.push("/carte")}
              >
                <div className="card-background"></div>
                <div className="card-content">
                  <p className="card-label-mobile">Carte de paiement</p>
                  <div className="card-details-mobile">
                    <IonIcon icon={cardOutline} className="card-icon-mobile" />
                    <div className="card-info-mobile">
                      <p className="card-name-mobile">EL AMEN WHITE EMV</p>
                      <p className="card-number-mobile">1234 •••• •••• 1234</p>
                    </div>
                    <p className="card-expiry-mobile">01/28</p>
                  </div>
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
                  <IonIcon icon={arrowForwardOutline} />
                  <IonRippleEffect />
                </IonButton>
              </div>
              <div
                className="budget-card-mobile ion-activatable"
                onClick={() => history.push("/budget")}
              >
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
        </div>
      </IonContent>
      <NavMobile currentPage="accueil" />
    </IonPage>
  )
}

export default AccueilMobile
