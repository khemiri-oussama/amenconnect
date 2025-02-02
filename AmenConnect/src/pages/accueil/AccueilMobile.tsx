import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const AccueilMobile: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Mobile Version</h2>
        <p>This is the mobile-specific content for the Accueil page.</p>
      </IonContent>
    </IonPage>
  )
}

export default AccueilMobile

