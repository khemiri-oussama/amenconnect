"use client"

import { IonButton, IonImg } from "@ionic/react"
import type React from "react"
import { useHistory } from "react-router-dom"
import "./NotFoundPage.css"

interface NotFoundProps {
  logoSrc?: string
  homePageUrl?: string
}

export const NotFound: React.FC<NotFoundProps> = ({ logoSrc = "../amen_logo.png", homePageUrl = "/" }) => {
  const history = useHistory()

  const handleNavigateHome = () => {
    history.push(homePageUrl)
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="logo-container">
          <IonImg src={logoSrc} alt="Logo" className="not-found-logo" />
        </div>

        <div className="not-found-main">
          <div className="error-code">404</div>
          <h1 className="error-title">Page non trouvée</h1>
          <p className="error-message">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>

          <div className="action-buttons">
            <IonButton expand="block" className="home-button" onClick={handleNavigateHome}>
              Retour à l'accueil
            </IonButton>
          </div>
        </div>

        <div className="animated-element">
          <div className="circle"></div>
          <div className="square"></div>
          <div className="triangle"></div>
        </div>
      </div>

      <div className="bg-gradient-1"></div>
      <div className="bg-gradient-2"></div>
    </div>
  )
}

export default NotFound

