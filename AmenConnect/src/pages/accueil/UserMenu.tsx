import { IonIcon } from "@ionic/react"
import {
  personOutline,
  shieldOutline,
  helpCircleOutline,
  mailOutline,
  informationCircleOutline,
  globeOutline,
} from "ionicons/icons"
import type React from "react" // Added import for React

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="menu-backdrop" onClick={onClose} />
      <div className="user-menu">
        <button className="menu-item">
          <IonIcon icon={personOutline} />
          Profil
        </button>
        <button className="menu-item">
          <IonIcon icon={shieldOutline} />
          Paramètres de sécurité
        </button>
        <button className="menu-item">
          <IonIcon icon={helpCircleOutline} />
          Nos services
        </button>
        <button className="menu-item">
          <IonIcon icon={mailOutline} />
          Nous contacter
        </button>
        <button className="menu-item">
          <IonIcon icon={informationCircleOutline} />A propos
        </button>
        <button className="menu-item">
          <IonIcon icon={informationCircleOutline} />
          Informations
        </button>
        <button className="menu-item">
          <IonIcon icon={globeOutline} />
          Visiter le site AMEN BANK
        </button>
        <button className="menu-item">
          <IonIcon icon={globeOutline} />
          Visiter le site @mennet
        </button>
      </div>
    </>
  )
}

