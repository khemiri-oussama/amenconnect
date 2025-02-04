import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const LoginKiosk: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Kiosk Version</h2>
        <p>This is the Kiosk-specific content for the Login page.</p>
      </IonContent>
    </IonPage>
  )
}

export default LoginKiosk