import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const CarteDesktop: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Desktop Version</h2>
        <p>This is the Desktop-specific content for the Carte page.</p>
      </IonContent>
    </IonPage>
  )
}

export default CarteDesktop