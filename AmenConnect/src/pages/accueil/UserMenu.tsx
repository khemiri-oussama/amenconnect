import { IonIcon } from "@ionic/react"
import {
  personOutline,
  shieldOutline,
  helpCircleOutline,
  mailOutline,
  informationCircleOutline,
  globeOutline,
} from "ionicons/icons"
import type React from "react"
import { useHistory } from "react-router-dom"

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const history = useHistory()

  if (!isOpen) return null

  const handleNavigation = (path: string) => {
    history.push(path)
    onClose()
  }

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="user-menu">
        <button className="menu-item" onClick={() => handleNavigation("/profile")}>
          <IonIcon icon={personOutline} />
          Profil
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/security-settings")}>
          <IonIcon icon={shieldOutline} />
          Paramètres de sécurité
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/services")}>
          <IonIcon icon={helpCircleOutline} />
          Nos services
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/contact")}>
          <IonIcon icon={mailOutline} />
          Nous contacter
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/about")}>
          <IonIcon icon={informationCircleOutline} />A propos
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/information")}>
          <IonIcon icon={informationCircleOutline} />
          Informations
        </button>
        <button className="menu-item" onClick={() => window.open("https://www.amenbank.com.tn", "_blank")}>
          <IonIcon icon={globeOutline} />
          Visiter le site AMEN BANK
        </button>
        <button className="menu-item" onClick={() => window.open("https://www.amennet.com.tn", "_blank")}>
          <IonIcon icon={globeOutline} />
          Visiter le site @mennet
        </button>
      </div>
    </>
  )
}

