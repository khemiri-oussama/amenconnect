import { IonContent, IonPage, IonCard, IonCardContent, IonIcon, IonTabBar, IonTabButton, IonLabel } from "@ionic/react"
import { home, card, chatbubble, wallet, timer } from "ionicons/icons"

export default function Home() {
  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ "--background": "#1c1c1e" }}>
        {/* Greeting Section */}
        <div className="ion-padding-bottom">
          <h1 className="ion-no-margin" style={{ color: "white", fontSize: "24px" }}>
            Bonjour,
          </h1>
          <h2 className="ion-no-margin" style={{ color: "white", fontSize: "20px" }}>
            Foulen Ben Foulen
          </h2>
        </div>

        {/* Account Balance Card */}
        <IonCard style={{ background: "#2c2c2e", margin: "16px 0" }}>
          <IonCardContent>
            <div className="ion-padding-bottom">
              <p style={{ color: "#8e8e93", margin: "0" }}>Compte Épargne</p>
              <h1 style={{ color: "#4cd964", margin: "8px 0", fontSize: "24px" }}>0.000 TND</h1>
              <div className="ion-text-end" style={{ color: "#8e8e93", fontSize: "14px" }}>
                <span>12345678876</span>
                <span style={{ marginLeft: "8px" }}>20/01/2025</span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Cards Section */}
        <div style={{ marginBottom: "16px" }}>
          <div
            className="ion-padding-bottom"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <h3 style={{ color: "white", margin: "0" }}>Cartes</h3>
            <span style={{ color: "#8e8e93" }}>Afficher tout</span>
          </div>
          <IonCard style={{ background: "#2c2c2e" }}>
            <IonCardContent>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#8e8e93", margin: "0" }}>Carte de paiement</p>
                  <p style={{ color: "white", margin: "4px 0" }}>EL AMEN WHITE EMV</p>
                  <p style={{ color: "#8e8e93", margin: "0" }}>1234 •••• •••• 1234</p>
                </div>
                <span style={{ color: "#007aff" }}>01/28</span>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Budget Section */}
        <div>
          <div
            className="ion-padding-bottom"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <h3 style={{ color: "white", margin: "0" }}>Budget</h3>
            <span style={{ color: "#8e8e93" }}>Afficher tout</span>
          </div>
          <IonCard style={{ background: "#2c2c2e", minHeight: "100px" }}>
            <IonCardContent>{/* Budget content would go here */}</IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      {/* Bottom Tab Bar */}
      <IonTabBar slot="bottom" style={{ "--background": "#2c2c2e" }}>
        <IonTabButton tab="accueil" href="/accueil">
          <IonIcon icon={home} style={{ color: "#4cd964" }} />
          <IonLabel style={{ color: "#4cd964" }}>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="compte" href="/compte">
          <IonIcon icon={wallet} />
          <IonLabel>Compte</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chat" href="/chat">
          <IonIcon icon={chatbubble} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
        <IonTabButton tab="carte" href="/carte">
          <IonIcon icon={card} />
          <IonLabel>Carte</IonLabel>
        </IonTabButton>
        <IonTabButton tab="virements" href="/virements">
          <IonIcon icon={timer} />
          <IonLabel>Virements</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  )
}

