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

interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: string
}

const AccueilMobile: React.FC = () => {
  const history = useHistory()
  const { profile, authLoading } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [today, setToday] = useState<string>("")
  const [cartes, setCartes] = useState<CardDetails[]>([])
  const [isLoadingCartes, setIsLoadingCartes] = useState(true)

  useEffect(() => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setToday(formattedDate)
  }, [])

  // Fetch cartes data from profile
  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cartesData = profile.cartes.map((carte) => ({
        cardNumber: carte.CardNumber,
        cardHolder: carte.CardHolder,
        expiryDate: carte.ExpiryDate,
        cardType: "Carte bancaire",
      }))
      setCartes(cartesData)
      setIsLoadingCartes(false)
    }
  }, [profile])

  if (authLoading || isLoadingCartes) {
    return (
      <div className="loading-container">
        <p>Chargement des données...</p>
      </div>
    )
  }

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

  const formatCardNumber = (cardNumber: string): string => {
    if (!cardNumber) return ''
    // Show only last 4 digits with •••• prefix
    const masked = cardNumber.slice(0, -4).replace(/\d/g, '•') + cardNumber.slice(-4)
    return masked.replace(/(.{4})/g, '$1 ').trim() // Format with spaces
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
              {cartes.length > 0 ? (
                cartes.map((carte, index) => (
                  <div
                    key={index}
                    className="payment-card-mobile ion-activatable"
                    onClick={() => history.push("/carte")}
                  >
                    <div className="card-background"></div>
                    <div className="card-content">
                      <p className="card-label-mobile">Carte de paiement</p>
                      <div className="card-details-mobile">
                        <IonIcon icon={cardOutline} className="card-icon-mobile" />
                        <div className="card-info-mobile">
                          <p className="card-name-mobile">{carte.cardType}</p>
                          <p className="card-number-mobile">
                            {formatCardNumber(carte.cardNumber)}
                          </p>
                        </div>
                        <p className="card-expiry-mobile">{carte.expiryDate}</p>
                      </div>
                    </div>
                    <IonRippleEffect />
                  </div>
                ))
              ) : (
                <p className="no-cards-mobile">Aucune carte disponible</p>
              )}
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