"use client"

import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonButton, IonIcon, IonRippleEffect } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { personOutline, logInOutline, peopleOutline, chevronForwardOutline } from "ionicons/icons"
import KioskLayout from "../components/KioskLayout"
import AnimatedCard from "../components/AnimatedCard"
import { useOrientation } from "../context/OrientationContext"
import "./Home.css"

const Home: React.FC = () => {
  const history = useHistory()
  const { isLandscape } = useOrientation()
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingOption, setLoadingOption] = useState<string | null>(null)

  const handleNavigation = (path: string, option: string) => {
    setIsLoading(true)
    setLoadingOption(option)

    // Add a small delay for better UX
    setTimeout(() => {
      setIsLoading(false)
      setLoadingOption(null)
      history.push(path)
    }, 300)
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <KioskLayout>
          <div className="home-container">
            <AnimatedCard delay={100}>
              <div className="home-welcome">
                <h1>Bienvenue chez AmenBank</h1>
                <p>Quels sont vos besoins bancaires aujourd'hui?</p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="home-options-container">
                {!showOptions ? (
                  <IonButton className="home-start-button" onClick={toggleOptions} disabled={isLoading}>
                    <span>Commencer</span>
                    <div className="home-button-icon">
                      <IonIcon icon={chevronForwardOutline} />
                    </div>
                    <IonRippleEffect />
                  </IonButton>
                ) : (
                  <div className={`home-options-grid ${isLandscape ? "landscape" : "portrait"}`}>
                    <div className="home-option guest-option">
                      <IonButton
                        className="home-option-button"
                        fill="clear"
                        disabled={isLoading}
                        onClick={() => handleNavigation("/mode-invite", "guest")}
                      >
                        <div className="home-option-content">
                          <div className="home-option-icon">
                            <IonIcon icon={personOutline} />
                          </div>
                          <div className="home-option-text">
                            <h3>Mode invite</h3>
                            <p>Explorer sans compte</p>
                          </div>
                          <div className="home-option-arrow">
                            <IonIcon icon={chevronForwardOutline} />
                          </div>
                        </div>
                        <IonRippleEffect />
                      </IonButton>
                    </div>

                    <div className="home-option login-option">
                      <IonButton
                        className="home-option-button"
                        fill="clear"
                        disabled={isLoading}
                        onClick={() => handleNavigation("/login", "login")}
                      >
                        <div className="home-option-content">
                          <div className="home-option-icon">
                            <IonIcon icon={logInOutline} />
                          </div>
                          <div className="home-option-text">
                            <h3>Se connecter</h3>
                            <p>Accéder à votre compte</p>
                          </div>
                          <div className="home-option-arrow">
                            <IonIcon icon={chevronForwardOutline} />
                          </div>
                        </div>
                        <IonRippleEffect />
                      </IonButton>
                    </div>

                    <div className="home-option register-option">
                      <IonButton
                        className="home-option-button"
                        fill="clear"
                        disabled={isLoading}
                        onClick={() => handleNavigation("/account-creation", "register")}
                      >
                        <div className="home-option-content">
                          <div className="home-option-icon">
                            <IonIcon icon={peopleOutline} />
                          </div>
                          <div className="home-option-text">
                            <h3>Devenir client</h3>
                            <p>Créer un nouveau compte</p>
                          </div>
                          <div className="home-option-arrow">
                            <IonIcon icon={chevronForwardOutline} />
                          </div>
                        </div>
                        <IonRippleEffect />
                      </IonButton>
                    </div>

                    <div className="home-quick-access">
                      <IonButton className="home-back-button" fill="clear" onClick={toggleOptions}>
                        Retour
                        <IonRippleEffect />
                      </IonButton>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedCard>
          </div>
        </KioskLayout>
      </IonContent>
    </IonPage>
  )
}

export default Home

