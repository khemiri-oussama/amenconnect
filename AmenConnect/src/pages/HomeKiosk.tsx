import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const HomeKiosk: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Kiosk Version</h2>
        <p>This is the Kiosk-specific content for the Home page.</p>
      </IonContent>
    </IonPage>
  )
}

export default HomeKiosk