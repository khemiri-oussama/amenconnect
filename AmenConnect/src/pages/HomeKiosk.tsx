import type React from "react"
import { IonContent, IonPage,IonImg } from "@ionic/react"
import "./Homekiosk.css"
const HomeKiosk: React.FC = () => {
  return (
      <IonPage>
        <IonContent fullscreen>
          <div className="welcome-container" style={{ backgroundImage: `url(${'./background.png'})` }}>
            <div className="content-wrapper">
              <div className="logo"><IonImg src="favicon.png" alt="Amen Bank Logo" className="img" /></div>
              <h1 className="welcome-title">Bienvenue!</h1>
              <h2 className="banking-question">
                Quels sont vos besoins
                <br />
                bancaires aujourd'hui ?
              </h2>
              <button className="start-button">Commencez ici</button>
              <p className="success-message">
                La réussite est à<br />
                portée de clic.
              </p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    )
  }

export default HomeKiosk