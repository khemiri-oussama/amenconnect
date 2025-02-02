import type React from "react"
import { useState } from "react"
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react"
import { homeOutline, walletOutline, chatbubbleOutline, cardOutline, arrowForward } from "ionicons/icons"
import "./CarteMobile.css"

const CardMobile: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>("details")
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal">
        <div className="status-bar"></div>

        <h1 className="page-title">Mes cartes</h1>

        {/* Card Display */}
        <div className="card-display">
          <div className="credit-card">
            <div className="card-header">
              <span className="card-type">EL AMEN WHITE EMV</span>
            </div>
            <div className="card-body">
              <div className="chip"></div>
              <div className="card-number">1234 •••• •••• 1234</div>
              <div className="card-holder">Foulen ben foulen</div>
            </div>
            <div className="card-footer">
              <div className="expiry">
                <span>Expire à fin</span>
                <span>01/28</span>
              </div>
              <div className="bank-logo">
                <span className="bank-name">AMEN BANK</span>
                <div className="logo-circle"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Segments */}
        <IonSegment
          mode="ios"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
          className="custom-segment"
        >
          <IonSegmentButton value="encours">
            <IonLabel>Encours</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="details">
            <IonLabel>Détails</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="operations">
            <IonLabel>Opérations</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Card Details */}
        {selectedSegment === "details" && (
          <div className="card-details">
            <h2>Détails de la carte</h2>

            <div className="detail-item">
              <span className="detail-label">Titulaire de la carte</span>
              <span className="detail-value">Foulen Ben Foulen</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Type de la carte</span>
              <span className="detail-value">ELAMENWHITE EMV</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Plafond retrait</span>
              <span className="detail-value">10000.0</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Plafond total</span>
              <span className="detail-value">10000.0</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Date d'expiration</span>
              <span className="detail-value">01/27</span>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bottom-tabs">
          <button className="tab-button" onClick={() => history.push('/accueil')}>
            <IonIcon icon={homeOutline} />
            <span>Accueil</span>
          </button>
          <button className="tab-button" onClick={() => history.push('/compte')}>
            <IonIcon icon={walletOutline} />
            <span>Compte</span>
          </button>
          <button className="tab-button" onClick={() => history.push('/ChatBot')}>
            <IonIcon icon={chatbubbleOutline} />
            <span>Chat</span>
          </button>
          <button className="tab-button active">
            <IonIcon icon={cardOutline} />
            <span>Carte</span>
          </button>
          <button className="tab-button">
            <IonIcon icon={arrowForward} />
            <span>Virements</span>
          </button>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CardMobile

