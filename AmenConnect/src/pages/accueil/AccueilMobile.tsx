import type React from "react"
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"

const AccueilMobile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accueil (Mobile)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome to the Mobile Version</h2>
        <p>This is the mobile-specific content for the Accueil page.</p>
      </IonContent>
    </IonPage>
  )
}

export default AccueilMobile

