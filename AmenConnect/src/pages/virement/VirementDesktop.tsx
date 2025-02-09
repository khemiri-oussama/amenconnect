"use client"

import type React from "react"
import { useState } from "react"
import { IonContent, IonPage, IonIcon, IonSearchbar, IonRippleEffect, IonButton, IonBadge } from "@ionic/react"
import {
  cashOutline,
  businessOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  repeatOutline,
  timerOutline,
  helpCircleOutline,
  alertCircleOutline,
  trendingUpOutline,
  walletOutline,
  peopleOutline,
  settingsOutline,
  eyeOutline,
} from "ionicons/icons"
import { useHistory } from "react-router-dom"
import "./VirementDesktop.css"
import Navbar from "../../components/Navbar"

const VirementsDesktop: React.FC = () => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState("historique")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
<<<<<<< HEAD
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <Navbar />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Virement rapide</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonLabel position="floating">Bénéficiaire</IonLabel>
                    <IonInput value={beneficiary} onIonChange={(e) => setBeneficiary(e.detail.value!)} />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating">Montant (DT)</IonLabel>
                    <IonInput type="number" value={amount} onIonChange={(e) => setAmount(e.detail.value!)} />
                  </IonItem>
                  <IonButton expand="block" className="ion-margin-top">
                    Effectuer le virement
                    <IonIcon slot="end" icon={arrowForward} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Résumé des virements</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines="none">
                    <IonItem>
                      <IonIcon icon={trendingUp} slot="start" />
                      <IonLabel>
                        <h3>Total des virements ce mois</h3>
                        <p>5 250 DT</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon icon={repeat} slot="start" />
                      <IonLabel>
                        <h3>Nombre de virements</h3>
                        <p>12</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon icon={time} slot="start" />
                      <IonLabel>
                        <h3>Prochain virement prévu</h3>
                        <p>Loyer - 800 DT - 01/08/2023</p>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="12" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Historique des virements</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value!)}>
                    <IonSegmentButton value="history">
                      <IonLabel>Historique</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="pending">
                      <IonLabel>En attente</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                  <IonList>
                    {transfers.map((transfer) => (
                      <IonItem key={transfer.id}>
                        <IonLabel>
                          <h2>{transfer.name}</h2>
                          <p>{transfer.date}</p>
                        </IonLabel>
                        <IonBadge slot="end" color={transfer.amount > 0 ? "success" : "danger"}>
                          {transfer.amount > 0 ? "+" : ""}
                          {transfer.amount} DT
                        </IonBadge>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Actions rapides</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" fill="outline" className="ion-margin-bottom">
                    Nouveau virement
                  </IonButton>
                  <IonButton expand="block" fill="outline" className="ion-margin-bottom">
                    Gérer les virements récurrents
                  </IonButton>
                  <IonButton expand="block" fill="outline">
                    Télécharger le relevé
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol sizeMd="6" sizeLg="4">
              <IonCard className="glass-card">
                <IonCardHeader>
                  <IonCardTitle>Aide et informations</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList lines="none">
                    <IonListHeader>
                      <IonLabel>Limites de virement</IonLabel>
                    </IonListHeader>
                    <IonItem>
                      <IonLabel>Quotidien max : 10 000 DT</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Mensuel max : 50 000 DT</IonLabel>
                    </IonItem>
                    <IonListHeader>
                      <IonLabel>Délais de traitement</IonLabel>
                    </IonListHeader>
                    <IonItem>
                      <IonLabel>Interne : Instantané</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Externe : 1-2 jours ouvrés</IonLabel>
                    </IonItem>
                  </IonList>
                  <IonButton expand="block" fill="clear">
                    Centre d'aide
                    <IonIcon slot="end" icon={helpCircleOutline} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
=======
    <IonPage className="virements-desktop">
      <Navbar />
      <IonContent className="ion-padding virements-desktop-content">
        <div className="virements-dashboard-container">
          <div className="virements-welcome-section">
            <div className="virements-welcome-text">
              <h1 className="virements-welcome-title">Virements</h1>
              <p className="virements-welcome-subtitle">Gérez vos transferts d'argent en toute simplicité</p>
            </div>
            <div className="virements-welcome-actions">
              <IonButton fill="clear" className="virements-notification-button">
                <IonIcon slot="icon-only" icon={alertCircleOutline} />
              </IonButton>
              <IonButton fill="solid" className="virements-profile-button">
                Paramètres
                <IonIcon slot="end" icon={settingsOutline} />
              </IonButton>
            </div>
          </div>

          <div className="virements-main-grid">
            <div className="virements-section-card virements-quick-transfer-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={cashOutline} />
                  Virement rapide
                </h2>
              </div>
              <div className="virements-quick-transfer-form">
                <div className="virements-form-group">
                  <label htmlFor="beneficiary">Bénéficiaire</label>
                  <select id="beneficiary" className="virements-form-control">
                    <option>Choisir un bénéficiaire</option>
                    <option>Ahmed Ben Ali</option>
                    <option>Fatma Trabelsi</option>
                    <option>Mohamed Salah</option>
                  </select>
                </div>
                <div className="virements-form-group">
                  <label htmlFor="amount">Montant (DT)</label>
                  <input type="number" id="amount" className="virements-form-control" placeholder="0.00" />
                </div>
                <IonButton expand="block" className="virements-submit-button">
                  Effectuer le virement
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </IonButton>
              </div>
            </div>

            <div className="virements-section-card virements-transfer-options-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={repeatOutline} />
                  Options de virement
                </h2>
              </div>
              <div className="virements-transfer-options">
                <button className="virements-transfer-card" onClick={() => history.push("/beneficiary-transfer")}>
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={peopleOutline} />
                  </div>
                  <div className="virements-transfer-text">
                    <h3>Virement vers un bénéficiaire</h3>
                    <p>Effectuez un virement vers un compte bénéficiaire en toute sécurité</p>
                  </div>
                </button>

                <button className="virements-transfer-card" onClick={() => history.push("/account-transfer")}>
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={businessOutline} />
                  </div>
                  <div className="virements-transfer-text">
                    <h3>Virement de compte à compte</h3>
                    <p>Transférez des fonds entre vos propres comptes instantanément</p>
                  </div>
                </button>

                <button className="virements-transfer-card" onClick={() => history.push("/scheduled-transfer")}>
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={timerOutline} />
                  </div>
                  <div className="virements-transfer-text">
                    <h3>Virement programmé</h3>
                    <p>Planifiez des virements récurrents ou à une date future</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="virements-section-card virements-transfers-history-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={documentTextOutline} />
                  Historique des virements
                </h2>
                <IonSearchbar
                  placeholder="Rechercher un virement"
                  className="virements-desktop-searchbar"
                ></IonSearchbar>
              </div>
              <div className="virements-tabs-container">
                <button
                  className={`virements-tab-button ${activeTab === "historique" ? "active" : ""}`}
                  onClick={() => handleTabChange("historique")}
                >
                  <IonIcon icon={documentTextOutline} />
                  Historique
                </button>
                <button
                  className={`virements-tab-button ${activeTab === "a-signer" ? "active" : ""}`}
                  onClick={() => handleTabChange("a-signer")}
                >
                  <IonIcon icon={checkmarkCircleOutline} />
                  Virements à signer
                  <IonBadge color="danger">2</IonBadge>
                </button>
              </div>

              <div className="virements-transfers-list">
                <div className="virements-transfer-item">
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="virements-transfer-info">
                    <h3>Virement à Ahmed Ben Ali</h3>
                    <p>15 juillet 2023 • Compte courant</p>
                  </div>
                  <div className="virements-transfer-amount outgoing">-1000 DT</div>
                </div>
                <div className="virements-transfer-item">
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="virements-transfer-info">
                    <h3>Virement reçu de Société XYZ</h3>
                    <p>10 juillet 2023 • Compte épargne</p>
                  </div>
                  <div className="virements-transfer-amount incoming">+2500 DT</div>
                </div>
                <div className="virements-transfer-item">
                  <IonRippleEffect />
                  <div className="virements-transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="virements-transfer-info">
                    <h3>Virement à Fatma Trabelsi</h3>
                    <p>5 juillet 2023 • Compte courant</p>
                  </div>
                  <div className="virements-transfer-amount outgoing">-750 DT</div>
                </div>
              </div>
              <div className="virements-view-all-button">
                <IonButton fill="clear">
                  Voir tous les virements
                  <IonIcon slot="end" icon={eyeOutline} />
                </IonButton>
              </div>
            </div>

            <div className="virements-section-card virements-summary-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={walletOutline} />
                  Résumé des virements
                </h2>
              </div>
              <div className="virements-summary-cards">
                <div className="virements-summary-card">
                  <IonIcon icon={trendingUpOutline} />
                  <div>
                    <h3>Total des virements ce mois</h3>
                    <p className="virements-summary-amount">5,250 DT</p>
                  </div>
                </div>
                <div className="virements-summary-card">
                  <IonIcon icon={repeatOutline} />
                  <div>
                    <h3>Nombre de virements</h3>
                    <p className="virements-summary-amount">12</p>
                  </div>
                </div>
                <div className="virements-summary-card">
                  <IonIcon icon={timerOutline} />
                  <div>
                    <h3>Prochain virement prévu</h3>
                    <p className="virements-summary-text">Loyer - 800 DT - 01/08/2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="virements-section-card virements-quick-actions-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={settingsOutline} />
                  Actions rapides
                </h2>
              </div>
              <div className="virements-quick-actions">
                <IonButton expand="block" className="virements-quick-action-button">
                  <IonIcon slot="start" icon={cashOutline} />
                  Nouveau virement
                </IonButton>
                <IonButton expand="block" className="virements-quick-action-button">
                  <IonIcon slot="start" icon={repeatOutline} />
                  Gérer les virements récurrents
                </IonButton>
                <IonButton expand="block" className="virements-quick-action-button">
                  <IonIcon slot="start" icon={documentTextOutline} />
                  Télécharger le relevé
                </IonButton>
              </div>
            </div>

            <div className="virements-section-card virements-help-section">
              <div className="virements-section-header">
                <h2 className="virements-section-title">
                  <IonIcon icon={helpCircleOutline} />
                  Aide et informations
                </h2>
              </div>
              <div className="virements-help-content">
                <div className="virements-help-item">
                  <h3>
                    <IonIcon icon={alertCircleOutline} />
                    Limites de virement
                  </h3>
                  <p>Virement quotidien max : 10,000 DT</p>
                  <p>Virement mensuel max : 50,000 DT</p>
                </div>
                <div className="virements-help-item">
                  <h3>
                    <IonIcon icon={timerOutline} />
                    Délais de traitement
                  </h3>
                  <p>Virement interne : Instantané</p>
                  <p>Virement externe : 1-2 jours ouvrés</p>
                </div>
                <IonButton fill="clear" className="virements-help-button">
                  Centre d'aide
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </IonButton>
              </div>
            </div>
          </div>
        </div>
>>>>>>> bc6317a (v)
      </IonContent>
    </IonPage>
  )
}

export default VirementsDesktop

