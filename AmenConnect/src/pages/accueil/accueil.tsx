import { IonContent, IonPage, IonCard, IonCardContent, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react"
import { home, wallet, chatbubble, card, timer } from "ionicons/icons"
import "./Accueil.css"

export default function Accueil() {
  return (
    <IonPage className="accueil-page">
      <IonContent fullscreen>
        <div className="ion-padding">
          <div className="greeting">
            <h1>Bonjour,</h1>
            <h2>Foulen Ben Foulen</h2>
          </div>

          <IonCard className="account-card">
            <IonCardContent>
              <p className="account-label">Compte Épargne</p>
              <p className="account-balance">0.000 TND</p>
              <div className="account-details">
                <span>123456789876</span>
                <span>20/01/2025</span>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="section-header">
            <h3 className="section-title">Cartes</h3>
            <span className="section-action">Afficher tout</span>
          </div>

          <IonCard className="card-item">
            <IonCardContent>
              <div className="card-details">
                <div className="card-info">
                  <p className="card-type">Carte de paiement</p>
                  <p className="card-name">EL AMEN WHITE EMV</p>
                  <p className="card-number">1234 •••• •••• 1234</p>
                </div>
                <span className="card-expiry">01/28</span>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="section-header">
            <h3 className="section-title">Budget</h3>
            <span className="section-action">Afficher tout</span>
          </div>

          <IonCard className="budget-card">
            <IonCardContent>{/* Budget content would go here */}</IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      <IonTabBar slot="bottom" className="tab-bar">
        <IonTabButton tab="accueil" href="/accueil" className="tab-button">
          <IonIcon icon={home} />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="compte" href="/compte" className="tab-button">
          <IonIcon icon={wallet} />
          <IonLabel>Compte</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chat" href="/chat" className="tab-button">
          <IonIcon icon={chatbubble} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
        <IonTabButton tab="carte" href="/carte" className="tab-button">
          <IonIcon icon={card} />
          <IonLabel>Carte</IonLabel>
        </IonTabButton>
        <IonTabButton tab="virements" href="/virements" className="tab-button">
          <IonIcon icon={timer} />
          <IonLabel>Virements</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  )
}

