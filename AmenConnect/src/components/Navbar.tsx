import type React from "react"
import { IonToolbar, IonRouterLink, useIonRouter } from "@ionic/react"
import "./Navbar.css"

const Navbar: React.FC = () => {
  const router = useIonRouter()

  const handleCardClick = () => {
    console.log("Navigating to card management...")
    router.push("/cards")
  }

  return (
    <IonToolbar className="custom-toolbar">
      <IonRouterLink routerLink="/accueil" className="s">
      <img src="amen_logo.png" alt="Amen Bank Logo" className="navbar-logo" />
      </IonRouterLink>
      <div className="navbar-links">
        <IonRouterLink routerLink="/accueil" className="navbar-link">
          Accueil
        </IonRouterLink>
        <IonRouterLink routerLink="/compte" className="navbar-link">
          Comptes
        </IonRouterLink>
        <IonRouterLink routerLink="/chatBot" className="navbar-link">
          Chat
        </IonRouterLink>
        <IonRouterLink routerLink="/virement" className="navbar-link">
          Virements
        </IonRouterLink>
        <IonRouterLink routerLink="/carte" className="navbar-link" onClick={handleCardClick}>
          Cartes
        </IonRouterLink>
      </div>
    </IonToolbar>
  )
}

export default Navbar

