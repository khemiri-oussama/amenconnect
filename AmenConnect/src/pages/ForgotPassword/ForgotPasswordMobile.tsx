import type React from "react"
import { IonContent, IonPage} from "@ionic/react"

const ForgotPasswordMobile: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Welcome to the Mobile Version</h2>
        <p>This is the Mobile-specific content for the ForgotPassword page.</p>
      </IonContent>
    </IonPage>
  )
}

export default ForgotPasswordMobile