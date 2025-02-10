import type React from "react"
import { IonToolbar, IonRippleEffect } from "@ionic/react"
import { useHistory } from "react-router-dom"
import "./Navbar.css"

interface NavbarProps {
  currentPage: string
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const history = useHistory()

  return (
    <IonToolbar className="custom-toolbar">
      <div className="navbar-logo-container" >
        <img src="amen_logo.png" alt="Amen Bank Logo" className="navbar-logo" onClick={() => history.push("/accueil")}style={{ cursor: "pointer" }} />
      </div>

      <div className="navbar-links">
        <button 
          className={`navbar-link ion-activatable ${currentPage === "accueil" ? "active" : ""}`} 
          onClick={() => history.push("/accueil")}
        >
          Accueil
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "compte" ? "active" : ""}`} 
          onClick={() => history.push("/compte")}
        >
          Comptes
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "chat" ? "active" : ""}`} 
          onClick={() => history.push("/ChatBot")}
        >
          Chat
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "carte" ? "active" : ""}`} 
          onClick={() => history.push("/Carte")}
        >
          Cartes
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "virements" ? "active" : ""}`} 
          onClick={() => history.push("/virement")}
        >
          Virements
          <IonRippleEffect />
        </button>
      </div>
    </IonToolbar>
  )
}

export default Navbar
