"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonImg,
  IonCard,
  IonRippleEffect,
  IonToast,
  IonBadge,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  timeOutline,
  arrowBackOutline,
  homeOutline,
  calculatorOutline,
  mapOutline,
  helpCircleOutline,
  newspaperOutline,
  cardOutline,
  searchOutline,
  notificationsOutline,
} from "ionicons/icons"
import "./mode-invite.css"

const ModeInvite: React.FC = () => {
  const history = useHistory()
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [featuredService, setFeaturedService] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Update time every 30 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)

    // Add entrance animation class after component mounts
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    // Set a random featured service
    const services = ["Simulateurs", "Agences", "Cartes", "Actualités", "Aide", "Prêts"]
    setFeaturedService(services[Math.floor(Math.random() * services.length)])

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(timeInterval)
      clearTimeout(timer)
    }
  }, [])

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

  const handleFeatureClick = (feature: string) => {
    setToastMessage(`Fonctionnalité "${feature}" en cours de développement`)
    setShowToast(true)
  }

  const handleBack = () => {
    setPageLoaded(false)

    setTimeout(() => {
      history.push("/home")
    }, 300)
  }

  const filteredFeatures = (query: string) => {
    const features = [
      {
        name: "Simulateurs",
        icon: calculatorOutline,
        color: "blue",
        description: "Calculez vos prêts et investissements",
      },
      { name: "Agences", icon: mapOutline, color: "green", description: "Trouvez l'agence la plus proche" },
      { name: "Cartes", icon: cardOutline, color: "yellow", description: "Découvrez nos offres de cartes" },
      { name: "Actualités", icon: newspaperOutline, color: "blue", description: "Suivez nos dernières nouvelles" },
      { name: "Aide", icon: helpCircleOutline, color: "green", description: "Questions fréquentes et support" },
      { name: "Prêts", icon: homeOutline, color: "yellow", description: "Informations sur nos prêts" },
    ]

    if (!query) return features

    return features.filter(
      (feature) =>
        feature.name.toLowerCase().includes(query.toLowerCase()) ||
        feature.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-0">
        <div className="app-container">
          <div className="background-pattern"></div>

          <div className="top-section">
            <div className="date-time">
              <IonIcon icon={timeOutline} />
              <span>{formatDate(currentTime)}</span>
            </div>

            <div className="logo-container">
              <div className="bank-logo">
                <IonImg src="amen_logo.png" alt="AmenBank Logo" />
              </div>
            </div>
          </div>

          <div className={`content-card ${pageLoaded ? "show-card" : "hide-card"}`}>
            <div className="page-header">
              <IonButton className="back-button-top" fill="clear" onClick={handleBack}>
                <IonIcon icon={arrowBackOutline} slot="start" />
                Retour
              </IonButton>
              <h1 className="page-title">Mode Invite</h1>
              <div className="title-accent"></div>
              <p className="page-subtitle">Découvrez nos services sans vous connecter</p>
            </div>

            <div className="notification-banner">
              <div className="notification-icon">
                <IonIcon icon={notificationsOutline} />
              </div>
              <div className="notification-content">
                <p>
                  Nouveau! Découvrez notre service <strong>{featuredService}</strong>
                </p>
              </div>
              <IonButton
                fill="clear"
                size="small"
                className="notification-button"
                onClick={() => handleFeatureClick(featuredService || "")}
              >
                Découvrir
              </IonButton>
            </div>

            <div className="search-container">
              <div className={`search-box ${isSearchFocused ? "focused" : ""}`}>
                <IonIcon icon={searchOutline} className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            <div className="features-grid">
              {filteredFeatures(searchQuery).map((feature, index) => (
                <IonCard
                  key={index}
                  className={`feature-card ${feature.name === featuredService ? "featured" : ""}`}
                  onClick={() => handleFeatureClick(feature.name)}
                >
                  <div className={`feature-icon ${feature.color}`}>
                    <IonIcon icon={feature.icon} />
                  </div>
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                  {feature.name === featuredService && (
                    <IonBadge color="warning" className="feature-badge">
                      Nouveau
                    </IonBadge>
                  )}
                  <IonRippleEffect />
                </IonCard>
              ))}
            </div>

            <div className="cta-section">
              <p>Vous souhaitez accéder à tous nos services?</p>
              <div className="cta-buttons">
                <IonButton className="cta-button login" onClick={() => history.push("/login")}>
                  Se connecter
                  <IonRippleEffect />
                </IonButton>
                <IonButton className="cta-button register" onClick={() => history.push("/account-creation")}>
                  Créer un compte
                  <IonRippleEffect />
                </IonButton>
              </div>
            </div>
          </div>

          <footer className="app-footer">
            <div className="footer-content">© 2024 AmenBank. Tous droits réservés.</div>
          </footer>
        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="primary"
      />
    </IonPage>
  )
}

export default ModeInvite

