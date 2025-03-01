import { IonPopover, IonIcon,useIonRouter } from "@ionic/react"
import {
  
  personOutline,
  shieldOutline,
  helpCircleOutline,
  mailOutline,
  logOutOutline,
  globeOutline,
  informationCircleOutline,
  scanOutline // New icon for QR scanner
} from "ionicons/icons"
import React from "react"

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
 const ionRouter = useIonRouter();

  const handleNavigation = (path: string) => {
    ionRouter.push(path)
    onClose()
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    ionRouter.push("/login")
  }

  return (
    <IonPopover isOpen={isOpen} onDidDismiss={onClose}
     alignment="start"
    >
      <div className="user-menu">
        <button className="menu-item" onClick={() => handleNavigation("/profile")}>
          <IonIcon icon={personOutline} />
          Profil
        </button>
        <button className="menu-item" onClick={() => handleNavigation("/SecuritySettingsMobile")}>
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
          <IonIcon icon={informationCircleOutline} />
          A propos
        </button>
        <button
          className="menu-item"
          onClick={() => window.open("https://www.amenbank.com.tn", "_blank")}
        >
          <IonIcon icon={globeOutline} />
          Visiter le site AMEN BANK
        </button>
        <button
          className="menu-item"
          onClick={() => window.open("https://www.amennet.com.tn", "_blank")}
        >
          <IonIcon icon={globeOutline} />
          Visiter le site @mennet
        </button>
        {/* New Menu Item for QR Code Scanning */}
        <button className="menu-item" onClick={() => handleNavigation("/qr-scanner")}>
          <IonIcon icon={scanOutline} />
          Scanner QR Code
        </button>
        <button className="menu-item" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} /> Déconnecter
        </button>
      </div>
    </IonPopover>
  )
}
