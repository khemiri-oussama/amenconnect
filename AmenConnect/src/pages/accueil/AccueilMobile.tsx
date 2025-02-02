import { IonContent, IonHeader, IonPage, IonIcon, IonLabel } from '@ionic/react';
import { home, wallet, chatbubble, card, arrowForward, person, statsChart } from 'ionicons/icons';
import { useHistory } from 'react-router-dom'; // Import useHistory
import './AccueilMobile.css';
import React from 'react';

const Accueil: React.FC = () => {
  const history = useHistory(); // Hook for navigation

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="status-bar"></div>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        {/* Profile Header */}
        <div className="profile-header">
          <div>
            <p className="greeting">Bonjour,</p>
            <h1 className="username">Foulen Ben Foulen</h1>
          </div>
          <button className="profile-button">
            <IonIcon icon={person} />
          </button>
        </div>

        {/* Account Card */}
        <div className="account-card">
          <div className="account-header">
            <h2>Compte Epargne</h2>
            <IonIcon icon={statsChart} className="stats-icon" />
          </div>
          <div className="account-details">
            <div>
              <p className="balance">0.000 TND</p>
              <p className="account-number">12345678987</p>
            </div>
            <p className="expiry-date">20/01/2025</p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="section">
          <div className="section-header">
            <h2>Cartes</h2>
            <button className="view-all">Afficher tout</button>
          </div>
          <div className="payment-card">
            <p className="card-label">Carte de paiement</p>
            <div className="card-details">
              <IonIcon icon={card} className="card-icon" />
              <div className="card-info">
                <p className="card-name">EL AMEN WHITE EMV</p>
                <p className="card-number">1234 •••• •••• 1234</p>
              </div>
              <p className="card-expiry">01/28</p>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        <div className="section">
          <div className="section-header">
            <h2>Budget</h2>
            <button className="view-all">Afficher tout</button>
          </div>
          <div className="budget-card"></div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-tabs">
          <button className="tab-button active">
            <IonIcon icon={home} />
            <IonLabel>Accueil</IonLabel>
          </button>
          <button className="tab-button" onClick={() => history.push('/compte')}>
            <IonIcon icon={wallet} />
            <IonLabel>Compte</IonLabel>
          </button>
          <button className="tab-button">
            <IonIcon icon={chatbubble} />
            <IonLabel>Chat</IonLabel>
          </button>
          <button className="tab-button">
            <IonIcon icon={card} />
            <IonLabel>Carte</IonLabel>
          </button>
          <button className="tab-button">
            <IonIcon icon={arrowForward} />
            <IonLabel>Virements</IonLabel>
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Accueil;
