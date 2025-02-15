import type React from "react"
import { IonToolbar, IonRippleEffect } from "@ionic/react"
import { useHistory } from "react-router-dom"
import "./Navbar.css"

interface NavbarProps {
  currentPage: string
}

const NavbarAdmin: React.FC<NavbarProps> = ({ currentPage }) => {
  const history = useHistory()

  return (
    <IonToolbar className="custom-toolbar">
      <div className="navbar-logo-container" >
        <img src="amen_logo.png" alt="Amen Bank Logo" className="navbar-logo" onClick={() => history.push("/Dashboard")}style={{ cursor: "pointer" }} />
      </div>

      <div className="navbar-links">
        <button 
          className={`navbar-link ion-activatable ${currentPage === "Dashboard" ? "active" : ""}`} 
          onClick={() => history.push("/Dashboard")}
        >
          Dashboard
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "UserManagement" ? "active" : ""}`} 
          onClick={() => history.push("/UserManagement")}
        >
          Gestion des utilisateur
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "SurveillanceMonitoring" ? "active" : ""}`} 
          onClick={() => history.push("/SurveillanceMonitoring")}
        >
          Surveillance et Monitoring
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "PermissionsManagement" ? "active" : ""}`} 
          onClick={() => history.push("/PermissionsManagement")}
        >
          Gestion des Permissions
          <IonRippleEffect />
        </button>

        <button 
          className={`navbar-link ion-activatable ${currentPage === "AuthenticationSecurity" ? "active" : ""}`} 
          onClick={() => history.push("/AuthenticationSecurity")}
        >
            Sécurité de l’authentification
          <IonRippleEffect />
        </button>
        <button 
          className={`navbar-link ion-activatable ${currentPage === "InteractiveTotemManagement" ? "active" : ""}`} 
          onClick={() => history.push("/InteractiveTotemManagement")}
        >
            Gestion des Totems
          <IonRippleEffect />
        </button>
      </div>
    </IonToolbar>
  )
}

export default NavbarAdmin
