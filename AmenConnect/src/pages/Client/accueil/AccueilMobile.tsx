"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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

// Define CardDetails interface with an optional monthlyExpenses property
interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: string
  monthlyExpenses?: {
    current: number
    limit: number
  }
}

const AccueilMobile: React.FC = () => {
  const history = useHistory()
  const { profile, authLoading, refreshProfile } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [today, setToday] = useState<string>("")
  const [cartes, setCartes] = useState<CardDetails[]>([])
  const [isLoadingCartes, setIsLoadingCartes] = useState(true)
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [longPressProgress, setLongPressProgress] = useState(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressDuration = 500 // milliseconds

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)

  // Add these new state variables at the top of your component
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    setToday(formattedDate)
  }, [])

  // Map profile.cartes to our CardDetails array
  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cartesData = profile.cartes.map((carte) => ({
        cardNumber: carte.CardNumber,
        cardHolder: carte.CardHolder,
        expiryDate: carte.ExpiryDate,
        cardType: carte.TypeCarte,
        monthlyExpenses: carte.monthlyExpenses, // may be undefined
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

  const account = profile && profile.comptes && profile.comptes.length > 0 ? profile.comptes[currentAccountIndex] : null

  const toggleBalance = () => {
    setShowBalance(!showBalance)
  }

  // Refresh handler re-fetches the profile data
  const handleRefresh = async (event: CustomEvent) => {
    try {
      await refreshProfile()
    } catch (error) {
      console.error("Refresh failed:", error)
    } finally {
      event.detail.complete()
    }
  }

  const formatCardNumber = (cardNumber: string): string => {
    if (!cardNumber) return ""
    // Mask all but the last 4 digits
    const masked = cardNumber.slice(0, -4).replace(/\d/g, "•") + cardNumber.slice(-4)
    return masked.replace(/(.{4})/g, "$1 ").trim()
  }

  const handleLongPressStart = () => {
    setIsLongPressing(true)
    setLongPressProgress(0)
    longPressTimer.current = setInterval(() => {
      setLongPressProgress((prev) => {
        if (prev >= 100) {
          clearInterval(longPressTimer.current as NodeJS.Timeout)
          navigateAccounts()
          return 0
        }
        return prev + 10
      })
    }, longPressDuration / 10)
  }

  const handleLongPressEnd = () => {
    setIsLongPressing(false)
    setLongPressProgress(0)
    if (longPressTimer.current) {
      clearInterval(longPressTimer.current)
    }
  }

  const navigateAccounts = () => {
    setCurrentAccountIndex((prevIndex) => (prevIndex + 1) % (profile?.comptes?.length || 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      console.log(isLeftSwipe ? "swiped left" : "swiped right")
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Calculate the dynamic progress based on monthlyExpenses from the first card.
  // If no monthlyExpenses is available, fallback to 0%.
  const monthlyExpenses = cartes[0]?.monthlyExpenses
  const progressPercentage = monthlyExpenses
    ? Math.min((monthlyExpenses.current / monthlyExpenses.limit) * 100, 100)
    : 0

  // Add these handler functions
  const handleCardLongPress = (e: React.TouchEvent | React.MouseEvent, card: CardDetails) => {
    e.preventDefault()
    previewTimerRef.current = setTimeout(() => {
      setSelectedCard(card)
      setIsPreviewVisible(true)
      // Vibrate for feedback if available
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, 500)
  }

  const handleCardPressEnd = () => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current)
    }
  }

  const closePreview = () => {
    setIsPreviewVisible(false)
    setSelectedCard(null)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="custom-content-mobile" scrollY={true} forceOverscroll={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Tirer pour rafraîchir"
            refreshingSpinner="circles"
          ></IonRefresherContent>
        </IonRefresher>
        <div className="safe-area-padding">
          <div className="content-wrapper-mobile">
            {/* Profile Header */}
            <div className="profile-header-mobile">
              <div className="profile-info">
                <p className="greeting-mobile">Bonjour,</p>
                <h1 className="username-mobile">
                  {profile?.user.prenom || "Utilisateur"} {profile?.user.nom || ""}
                </h1>
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

            <div className="section-header-mobile">
              <h2>Comptes</h2>
            </div>

            {/* Account Card */}
            <div
              className="account-card-mobile ion-activatable"
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
            >
              <div className="account-header-mobile">
                <h2>{account ? account.type : "Compte Epargne"}</h2>
                <IonIcon icon={statsChartOutline} className="stats-icon-mobile" />
              </div>
              <div className="account-details-mobile">
                <div>
                  <div className="balance-container-mobile">
                    <p className="balance-mobile">
                      {showBalance ? (account ? `${account.solde} TND` : "450.0 TND") : "••••• TND"}
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
                  <p className="account-number-mobile">{account ? account.numéroCompte : "12345678987"}</p>
                </div>
                <p className="expiry-date-mobile">{today}</p>
              </div>
              {isLongPressing && (
                <div className="long-press-indicator">
                  <div className="long-press-progress" style={{ width: `${longPressProgress}%` }}></div>
                </div>
              )}
              <IonRippleEffect />
            </div>

            {/* Quick Actions */}
            <div
              className="quick-actions-mobile"
              ref={quickActionsRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <IonButton className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon icon={walletOutline} />
                <span>Virement</span>
              </IonButton>
              <IonButton className="quick-action-button" onClick={() => history.push("/paiement")}>
                <IonIcon icon={cardOutline} />
                <span>Paiement</span>
              </IonButton>
              <IonButton className="quick-action-button" onClick={() => history.push("/budget")}>
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
              <div className="cards-stack">
                {cartes.length > 0 ? (
                  cartes.map((carte, index) => (
                    <div
                      key={index}
                      className={`payment-card-mobile ion-activatable ${index % 2 === 1 ? "secondary" : ""}`}
                      onTouchStart={(e) => handleCardLongPress(e, carte)}
                      onTouchEnd={handleCardPressEnd}
                      onMouseDown={(e) => handleCardLongPress(e, carte)}
                      onMouseUp={handleCardPressEnd}
                      onMouseLeave={handleCardPressEnd}
                      style={{
                        zIndex: cartes.length - index,
                      }}
                    >
                      <div className="card-background"></div>
                      <div className="card-content">
                        <p className="card-label-mobile">{carte.cardType}</p>
                        <div className="card-details-mobile">
                          <IonIcon icon={cardOutline} className="card-icon-mobile" />
                          <div className="card-info-mobile">
                            <p className="card-name-mobile">{carte.cardHolder}</p>
                            <p className="card-number-mobile">{formatCardNumber(carte.cardNumber)}</p>
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

              {/* Card Preview Modal */}
              {isPreviewVisible && selectedCard && (
                <div className="card-preview-overlay" onClick={closePreview}>
                  <div className="card-preview-container" onClick={(e) => e.stopPropagation()}>
                    <div
                      className={`card-preview ${
                        selectedCard.cardType.toLowerCase().includes("visa")
                          ? "visa"
                          : selectedCard.cardType.toLowerCase().includes("mastercard")
                            ? "mastercard"
                            : selectedCard.cardType.toLowerCase().includes("gold")
                              ? "gold"
                              : "default"
                      }`}
                    >
                      <div className="card-preview-content">
                        <div className="card-preview-top">
                          <div className="card-chip-container">
                            <div className="card-chip"></div>
                            <svg
                              className="contactless-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-2-2-1.5 0-2 .62-2 2s.5 2 2 2z" />
                              <path d="M2 15.5a5.5 0 0 0 8.5-4.5c0-2.75-1-4-4-4-3 0-4 1.25-4 4s1 4 4 4z" />
                              <path d="M14.5 12a2.5 2.5 0 0 0 5 0c0-1.38-.5-2-2-2-1.5 0-2 .62-2 2s.5 2 2 2z" />
                            </svg>
                          </div>
                          <div className="card-brand">
                            <span className="brand-text">{selectedCard.cardType}</span>
                          </div>
                        </div>
                        <div className="card-preview-number">{formatCardNumber(selectedCard.cardNumber)}</div>
                        <div className="card-preview-bottom">
                          <div className="card-preview-holder">
                            <span className="preview-label">TITULAIRE</span>
                            <span className="preview-value">{selectedCard.cardHolder}</span>
                          </div>
                          <div className="card-preview-expiry">
                            <span className="preview-label">EXPIRE</span>
                            <span className="preview-value">{selectedCard.expiryDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Section */}
            <div className="section-mobile">
              <div className="section-header-mobile">
                <h2>Budget</h2>
                <IonButton
                  fill="clear"
                  className="view-all-mobile ion-activatable"
                  onClick={() => history.push("/compte")}
                >
                  Afficher tout
                  <IonIcon icon={arrowForwardOutline} />
                  <IonRippleEffect />
                </IonButton>
              </div>
              <div className="budget-card-mobile ion-activatable" onClick={() => history.push("/compte")}>
                <h3>Dépenses ce mois</h3>
                <div className="budget-progress-mobile">
                  <div className="progress-bar-mobile" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="budget-details-mobile">
                  <p>
                    {monthlyExpenses?.current ?? 0} / {monthlyExpenses?.limit ?? 2000} TND
                  </p>
                  <p className="budget-remaining-mobile">
                    Reste: {monthlyExpenses ? monthlyExpenses.limit - monthlyExpenses.current : 2000} TND
                  </p>
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

