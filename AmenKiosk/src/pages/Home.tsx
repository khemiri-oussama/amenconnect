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
  const ionRouter = useIonRouter()

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }
    inactivityTimer.current = setTimeout(() => {
      setActive(false)
      setShowOptions(false)
      setShowAccountForm(false)
      if (videoRef.current) {
        videoRef.current.play().catch((error) => console.error("Erreur lors de la lecture de la vidéo :", error))
      }
    }, 60000)
  }, [])

  const handleUserInteraction = useCallback(() => {
    if (!active) {
      setActive(true)
    }
    resetTimer()
  }, [active, resetTimer])

  const handleStartClick = () => {
    // Instead of using CSS transitions that might be causing issues,
    // let's directly update the state
    setShowOptions(true)
    resetTimer()
  }

  const handleGuestMode = () => {
    ionRouter.push("/modeinvite")
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
            <div className="homekiosk-content">
              <div className="homekiosk-logo">
                <IonImg src="favicon.png" alt="Amen Bank Logo" className="homekiosk-img" />
              </div>
              <h1 className="homekiosk-title">Bienvenue!</h1>

              {!showOptions ? (
                <>
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
                </>
              ) : (
                <div className="homekiosk-options-container">
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

            {/* Account Form Modal Popup */}
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
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              controls={false}
              onError={(e) => console.error("Erreur lors du chargement de la vidéo :", e)}
            >
              <source src="pub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default HomeKiosk

