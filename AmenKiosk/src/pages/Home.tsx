"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { IonContent, IonPage, IonButton, IonIcon, IonImg, IonRippleEffect, IonSpinner } from "@ionic/react"
import {
  timeOutline,
  chevronForwardOutline,
  personOutline,
  logInOutline,
  peopleOutline,
  fingerPrintOutline,
  arrowForwardOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./Home.css"

const Home: React.FC = () => {
  const history = useHistory()
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingOption, setLoadingOption] = useState<string | null>(null)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Update time every 30 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)

    // Set page as loaded after a short delay for entrance animation
    const loadTimer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(timeInterval)
      clearTimeout(loadTimer)
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

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  const handleNavigation = (path: string, option: string) => {
    setIsLoading(true)
    setLoadingOption(option)

    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false)
      setLoadingOption(null)
      history.push(path)
    }, 500)
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

          <div className={`content-card ${pageLoaded ? "show-card" : ""}`}>
            <div className="welcome-header">
              <h1 className="welcome-title">Bienvenue</h1>
              <h2 className="welcome-subtitle">Quels sont vos besoins bancaires aujourd'hui?</h2>
            </div>

            <div className="cta-container">
              {!showOptions ? (
                <IonButton className="start-button" expand="block" onClick={toggleOptions} disabled={isLoading}>
                  <span>Commencer ici</span>
                  <div className="button-icon">
                    <IonIcon icon={chevronForwardOutline} />
                  </div>
                  <IonRippleEffect />
                </IonButton>
              ) : (
                <div className={`options-grid ${showOptions ? "show-options" : ""}`}>
                  <div className="option-card guest">
                    <IonButton
                      className="option-button"
                      fill="clear"
                      expand="block"
                      disabled={isLoading}
                      onClick={() => handleNavigation("/mode-invite", "guest")}
                    >
                      <div className="option-content">
                        <div className="option-icon">
                          {loadingOption === "guest" ? (
                            <IonSpinner name="crescent" />
                          ) : (
                            <IonIcon icon={personOutline} />
                          )}
                        </div>
                        <div className="option-text">
                          <h3>Mode invite</h3>
                          <p>Explorer sans compte</p>
                        </div>
                        <div className="option-arrow">
                          <IonIcon icon={arrowForwardOutline} />
                        </div>
                      </div>
                      <IonRippleEffect />
                    </IonButton>
                  </div>

                  <div className="option-card login">
                    <IonButton
                      className="option-button"
                      fill="clear"
                      expand="block"
                      disabled={isLoading}
                      onClick={() => handleNavigation("/login", "login")}
                    >
                      <div className="option-content">
                        <div className="option-icon">
                          {loadingOption === "login" ? <IonSpinner name="crescent" /> : <IonIcon icon={logInOutline} />}
                        </div>
                        <div className="option-text">
                          <h3>Se connecter</h3>
                          <p>Accéder à votre compte</p>
                        </div>
                        <div className="option-arrow">
                          <IonIcon icon={arrowForwardOutline} />
                        </div>
                      </div>
                      <IonRippleEffect />
                    </IonButton>
                  </div>

                  <div className="option-card register">
                    <IonButton
                      className="option-button"
                      fill="clear"
                      expand="block"
                      disabled={isLoading}
                      onClick={() => handleNavigation("/account-creation", "register")}
                    >
                      <div className="option-content">
                        <div className="option-icon">
                          {loadingOption === "register" ? (
                            <IonSpinner name="crescent" />
                          ) : (
                            <IonIcon icon={peopleOutline} />
                          )}
                        </div>
                        <div className="option-text">
                          <h3>Devenir un client</h3>
                          <p>Créer un nouveau compte</p>
                        </div>
                        <div className="option-arrow">
                          <IonIcon icon={arrowForwardOutline} />
                        </div>
                      </div>
                      <IonRippleEffect />
                    </IonButton>
                  </div>

                  <div className="quick-access-section">
                    <p>Accès rapide</p>
                    <IonButton className="quick-access-button" fill="clear">
                      <IonIcon icon={fingerPrintOutline} />
                      <span>Connexion biométrique</span>
                    </IonButton>
                  </div>

                  <IonButton className="back-button" fill="clear" onClick={toggleOptions} disabled={isLoading}>
                    Retour
                  </IonButton>
                </div>
              )}
            </div>
          </div>

          <div className="tagline-section">
            <p className="welcome-tagline">La réussite est à portée de clic</p>
          </div>

          <footer className="app-footer">
            <div className="footer-content">© 2024 AmenBank. Tous droits réservés.</div>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home

