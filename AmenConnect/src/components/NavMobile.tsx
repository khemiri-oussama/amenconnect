import type React from "react"
import { useIonRouter, IonIcon, IonLabel, IonRippleEffect } from "@ionic/react"
import { homeOutline, walletOutline, chatbubbleOutline, cardOutline, arrowForward } from "ionicons/icons"
import "./NavMobile.css"
import { useHistory } from "react-router-dom"

interface NavMobileProps {
  currentPage: string
}

const NavMobile: React.FC<NavMobileProps> = ({ currentPage }) => {
  const history = useHistory()
  const router = useIonRouter()

  const handleCardClick = () => {
    console.log("Navigating to card management...")
    router.push("/cards")
  }

  return (
    <div className="bottom-tabs">
      <button className={`tab-button ion-activatable ${currentPage === "home" ? "active" : ""}`}>
        <IonIcon icon={homeOutline} />
        <IonLabel>Accueil</IonLabel>
        <IonRippleEffect />
      </button>
      <button
        className={`tab-button ion-activatable ${currentPage === "compte" ? "active" : ""}`}
        onClick={() => history.push("/compte")}
      >
        <IonIcon icon={walletOutline} />
        <IonLabel>Compte</IonLabel>
        <IonRippleEffect />
      </button>
      <button
        className={`tab-button ion-activatable ${currentPage === "chat" ? "active" : ""}`}
        onClick={() => history.push("/ChatBot")}
      >
        <IonIcon icon={chatbubbleOutline} />
        <IonLabel>Chat</IonLabel>
        <IonRippleEffect />
      </button>
      <button
        className={`tab-button ion-activatable ${currentPage === "carte" ? "active" : ""}`}
        onClick={() => history.push("/Carte")}
      >
        <IonIcon icon={cardOutline} />
        <IonLabel>Carte</IonLabel>
        <IonRippleEffect />
      </button>
      <button className={`tab-button ion-activatable ${currentPage === "virements" ? "active" : ""}`}>
        <IonIcon icon={arrowForward} />
        <IonLabel>Virements</IonLabel>
        <IonRippleEffect />
      </button>
    </div>
  )
}

export default NavMobile

