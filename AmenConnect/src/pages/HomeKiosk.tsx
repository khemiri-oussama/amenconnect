"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { IonContent, IonPage, IonImg, useIonRouter } from "@ionic/react"
import "./Homekiosk.css"
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
    const content = document.querySelector(".homekiosk-content")
    if (content) {
      content.classList.add("animate-transition")
    }

    setTimeout(() => {
      setShowOptions(true)
      resetTimer()
    }, 300)
  }

  const handleGuestMode = () => {
    console.log("Mode invite selected")
    resetTimer()
  }

  const handleLogin = () => {
    console.log("Se connecter selected")
    // Navigate to the login route
    ionRouter.push("/login")
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
            <div className="background-white"></div>
            <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
              <path
                d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
                fill="#47CE65"
                stroke="#47CE65"
              />
            </svg>
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
                  <button className="homekiosk-btn" onClick={handleStartClick}>
                    Commencez ici
                  </button>
                  <p className="homekiosk-message">
                    La réussite est à
                    <br />
                    portée de clic.
                  </p>
                </>
              ) : (
                <div className="homekiosk-options">
                  <h2 className="homekiosk-question animate-fade-in">Choisissez votre mode d'accès</h2>
                  <div className="homekiosk-buttons">
                    <button className="homekiosk-btn homekiosk-btn-guest animate-staggered" onClick={handleGuestMode}>
                      Mode invite
                    </button>
                    <button className="homekiosk-btn homekiosk-btn-login animate-staggered" onClick={handleLogin}>
                      Se connecter
                    </button>
                  </div>
                  <button
                    className="homekiosk-btn homekiosk-btn-account animate-staggered"
                    onClick={handleAccountCreation}
                  >
                    Devenir Client
                  </button>
                  <p className="homekiosk-message animate-fade-in">
                    La réussite est à
                    <br />
                    portée de clic.
                  </p>
                </div>
              )}
            </div>

            {/* Account Form Modal Popup - Pass resetTimer to the AccountCreationForm */}
            {showAccountForm && (
              <div className="modal-overlay" onClick={handleBackToOptions}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                  <AccountCreationForm onBack={handleBackToOptions} resetTimer={resetTimer} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="homekiosk-video-container" style={{ width: "100vw", height: "100vh" }}>
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              controls={false}
              onError={(e) => console.error("Erreur lors du chargement de la vidéo :", e)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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

