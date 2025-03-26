import React, { useState, useEffect } from "react"
import { IonIcon } from "@ionic/react"
import { timeOutline, logoEuro } from "ionicons/icons"
import { useOrientation } from "../context/OrientationContext"

interface KioskLayoutProps {
  children: React.ReactNode
  pageTitle?: string
  showLogo?: boolean
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children, pageTitle, showLogo = true }) => {
  const { isLandscape } = useOrientation()
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return currentTime.toLocaleDateString("fr-FR", options)
  }
  
  const formatTime = () => {
    return currentTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`kiosk-container ${isLandscape ? 'landscape' : 'portrait'}`}>
      <div className="kiosk-background"></div>
      
      <header className="kiosk-header">
        <div className="kiosk-header-content">
          <div className="kiosk-datetime">
            <div className="kiosk-date">
              <IonIcon icon={timeOutline} />
              <span>{formatDate()}</span>
            </div>
            <div className="kiosk-time">{formatTime()}</div>
          </div>
          
          {showLogo && (
            <div className="kiosk-logo">
              <img src="amen_logo.png" alt="AmenBank Logo" />
            </div>
          )}
          
          <div className="kiosk-header-extra">
            <div className="kiosk-currency">
              <IonIcon icon={logoEuro} />
              <span>EUR: 3.42 TND</span>
            </div>
          </div>
        </div>
        
        {pageTitle && <h1 className="kiosk-page-title">{pageTitle}</h1>}
      </header>
      
      <main className="kiosk-main">
        {children}
      </main>
      
      <footer className="kiosk-footer">
        <div className="kiosk-footer-content">
          <p>© {currentTime.getFullYear()} AmenBank. Tous droits réservés.</p>
          <p className="kiosk-slogan">La réussite est à portée de clic</p>
        </div>
      </footer>
    </div>
  )
}

export default KioskLayout
