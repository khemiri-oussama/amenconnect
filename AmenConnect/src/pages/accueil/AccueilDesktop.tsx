import type React from "react"
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"

const AccueilDesktop: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accueil (Desktop)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome to the Desktop Version</h2>
        <p>This is the desktop-specific content for the Accueil page.</p>
      </IonContent>
    </IonPage>
  )
}

export default AccueilDesktop

