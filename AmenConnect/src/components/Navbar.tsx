import type React from "react"
import { IonToolbar, IonRippleEffect, useIonRouter } from "@ionic/react"
import "./Navbar.css"

interface NavbarProps {
  currentPage: string
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const router = useIonRouter()

  // Use router.push with a direction ("forward" in this case)
  const navigateTo = (path: string) => {
    router.push(path, "forward", "push")
  }

  return (
    <IonToolbar className="custom-toolbar">
      <div className="navbar-logo-container">
        <img
          src="amen_logo.png"
          alt="Amen Bank Logo"
          className="navbar-logo"
          onClick={() => navigateTo("/accueil")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="navbar-links">
        <button
          className={`navbar-link ion-activatable ${currentPage === "accueil" ? "active" : ""}`}
          onClick={() => navigateTo("/accueil")}
        >
          Accueil
          <IonRippleEffect />
        </button>

        <button
          className={`navbar-link ion-activatable ${currentPage === "compte" ? "active" : ""}`}
          onClick={() => navigateTo("/compte")}
        >
          Comptes
          <IonRippleEffect />
        </button>

        <button
          className={`navbar-link ion-activatable ${currentPage === "chat" ? "active" : ""}`}
          onClick={() => navigateTo("/ChatBot")}
        >
          Chat
          <IonRippleEffect />
        </button>

        <button
          className={`navbar-link ion-activatable ${currentPage === "carte" ? "active" : ""}`}
          onClick={() => navigateTo("/Carte")}
        >
          Cartes
          <IonRippleEffect />
        </button>

        <button
          className={`navbar-link ion-activatable ${currentPage === "virements" ? "active" : ""}`}
          onClick={() => navigateTo("/virement")}
        >
          Virements
          <IonRippleEffect />
        </button>
      </div>
    </IonToolbar>
  )
}

export default Navbar
