import type React from "react"
import { IonToolbar, IonRippleEffect, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { homeOutline, walletOutline, chatbubbleOutline, cardOutline, swapHorizontalOutline } from "ionicons/icons"
import "./NavbarKiosk.css"

interface NavbarKioskProps {
  currentPage: string
}

const NavbarKiosk: React.FC<NavbarKioskProps> = ({ currentPage }) => {
  const history = useHistory()

  const navItems = [
    { id: "accueil", label: "Accueil", icon: homeOutline, path: "/accueil" },
    { id: "compte", label: "Comptes", icon: walletOutline, path: "/compte" },
    { id: "chat", label: "Chat", icon: chatbubbleOutline, path: "/ChatBot" },
    { id: "carte", label: "Cartes", icon: cardOutline, path: "/Carte" },
    { id: "virements", label: "Virements", icon: swapHorizontalOutline, path: "/virement" },
  ]

  return (
    <IonToolbar className="navbar-kiosk-toolbar">
      <div className="navbar-kiosk-container">
        <div className="navbar-kiosk-logo-container">
          <img
            src="amen_logo.png"
            alt="Amen Bank Logo"
            className="navbar-kiosk-logo"
            onClick={() => history.push("/accueil")}
          />
        </div>

        <div className="navbar-kiosk-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar-kiosk-link ion-activatable ${currentPage === item.id ? "active" : ""}`}
              onClick={() => history.push(item.path)}
            >
              <div className="navbar-kiosk-link-content">
                <IonIcon icon={item.icon} className="navbar-kiosk-icon" />
                <span className="navbar-kiosk-label">{item.label}</span>
              </div>
              <IonRippleEffect />
            </button>
          ))}
        </div>
      </div>
    </IonToolbar>
  )
}

export default NavbarKiosk

