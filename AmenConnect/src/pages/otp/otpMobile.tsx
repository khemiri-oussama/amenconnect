import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const otpMobile: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Mobile Version</h2>
        <p>This is the Mobile-specific content for the otp page.</p>
      </IonContent>
    </IonPage>
  )
}

export default otpMobile