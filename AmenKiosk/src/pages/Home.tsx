"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { IonContent, IonPage, IonImg, useIonRouter } from "@ionic/react"
import "./Home.css"
import AccountCreationForm from "./AccountCreationForm"

const HomeKiosk: React.FC = () => {
  const [active, setActive] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const ionRouter = useIonRouter()

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Enhanced timer reset with configurable timeout
  const INACTIVITY_TIMEOUT = 60000 // 60 seconds

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      setActive(false)
      setShowOptions(false)
      setShowAccountForm(false)
      if (videoRef.current) {
        videoRef.current.currentTime = 0 // Reset video to beginning
        videoRef.current.play().catch((error) => console.error("Erreur lors de la lecture de la vidéo :", error))
      }
    }, INACTIVITY_TIMEOUT)
  }, [])

  const handleUserInteraction = useCallback(() => {
    if (!active) {
      setActive(true)
    }
    resetTimer()
  }, [active, resetTimer])

  const handleStartClick = () => {
    setShowOptions(true)
    resetTimer()
  }

  const handleGuestMode = () => {
    try {
      ionRouter.push("/modeinvite", "forward", "push")
    } catch (error) {
      console.error("Navigation error:", error)
      // Fallback navigation
      window.location.href = "/modeinvite"
    }
    resetTimer()
  }

  const handleLogin = () => {
    try {
      ionRouter.push("/login", "forward", "push")
    } catch (error) {
      console.error("Navigation error:", error)
      // Fallback navigation
      window.location.href = "/login"
    }
    resetTimer()
  }

  const handleAccountCreation = () => {
    setShowOptions(false)
    setShowAccountForm(true)
    resetTimer()
  }

  const handleBackToOptions = () => {
    setShowAccountForm(false)
    setShowOptions(true)
    resetTimer()
  }

  // Handle video loading
  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur lors du chargement de la vidéo :", e)
    setVideoLoaded(true) // Still set to true to show UI even if video fails
  }

  useEffect(() => {
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("click", handleUserInteraction)

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("click", handleUserInteraction)
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [handleUserInteraction])

  return (
    <IonPage>
      <IonContent fullscreen>
        {active ? (
          <div className="homekiosk-container">
            <div className="homekiosk-bg-circle-1"></div>
            <div className="homekiosk-bg-circle-2"></div>
            <div className="homekiosk-bg-blob"></div>

            <div className="homekiosk-content">
              <div className="homekiosk-logo">
                <IonImg src="favicon.png" alt="Amen Bank Logo" className="homekiosk-img" />
              </div>
              <h1 className="homekiosk-title">Bienvenue!</h1>

              {!showOptions ? (
                <div className="homekiosk-welcome animate-fade-in">
                  <h2 className="homekiosk-question">
                    Quels sont vos besoins
                    <br />
                    bancaires aujourd'hui ?
                  </h2>
                  <button className="kiosk-btn" onClick={handleStartClick}>
                    Commencez ici
                  </button>
                  <p className="homekiosk-message">
                    La réussite est à
                    <br />
                    portée de clic.
                  </p>
                </div>
              ) : (
                <div className="homekiosk-options-container animate-fade-in">
                  <h2 className="homekiosk-question">Choisissez votre mode d'accès</h2>
                  <div className="homekiosk-buttons">
                    <button className="homekiosk-button homekiosk-button-guest" onClick={handleGuestMode}>
                      Mode invite
                    </button>
                    <button className="homekiosk-button homekiosk-button-login" onClick={handleLogin}>
                      Se connecter
                    </button>
                  </div>
                  <button className="homekiosk-button homekiosk-button-account" onClick={handleAccountCreation}>
                    Devenir Client
                  </button>
                  <p className="homekiosk-message">
                    La réussite est à
                    <br />
                    portée de clic.
                  </p>
                </div>
              )}
            </div>

            {/* Account Form Modal Popup with improved styling and animation */}
            {showAccountForm && (
              <div className="modal-overlay" onClick={handleBackToOptions}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                  <AccountCreationForm onBack={handleBackToOptions} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="homekiosk-video-container">
            {!videoLoaded && (
              <div className="video-loading">
                <IonImg src="favicon.png" alt="Amen Bank Logo" className="video-loading-logo" />
                <div className="video-loading-spinner"></div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              className={videoLoaded ? "video-loaded" : ""}
            >
              <source src="pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <div className="video-overlay">
              <div className="video-tap-instruction">
                <span>Touchez l'écran pour continuer</span>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default HomeKiosk

