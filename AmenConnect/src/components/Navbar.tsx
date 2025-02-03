import type React from "react"
import { IonToolbar } from "@ionic/react"
import "./Navbar.css"

const Navbar: React.FC = () => {
  const handleCardClick = () => {
    console.log("Navigating to card management...")
  }

  return (
    <IonToolbar className="custom-toolbar">
      <img src="amen_logo.png" alt="Amen Bank Logo" className="navbar-logo" />
      <div className="navbar-links">
        <a href="#" className="navbar-link" onClick={handleCardClick}>
          Accueil
        </a>
        <a href="#" className="navbar-link">
          Comptes
        </a>
        <a href="#" className="navbar-link">
          Chat
        </a>
        <a href="#" className="navbar-link">
          Virements
        </a>
        <a href="#" className="navbar-link">
          Cartes
        </a>
      </div>
    </IonToolbar>
  )
}

export default Navbar

