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

const VirementDesktop: React.FC = () => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState("historique")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <IonPage className="virements-desktop">
      <Navbar />
      <IonContent className="ion-padding custom-content">
        <div className="dashboard-container">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1 className="welcome-title">Virements</h1>
              <p className="welcome-subtitle">Gérez vos transferts d'argent en toute simplicité</p>
            </div>
            <div className="welcome-actions">
              <IonButton fill="clear" className="notification-button">
                <IonIcon slot="icon-only" icon={alertCircleOutline} />
              </IonButton>
              <IonButton fill="solid" className="profile-button">
                Paramètres
                <IonIcon slot="end" icon={settingsOutline} />
              </IonButton>
            </div>
          </div>

          <div className="main-grid">
            <div className="section-card quick-transfer-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={cashOutline} />
                  Virement rapide
                </h2>
              </div>
              <div className="quick-transfer-form">
                <div className="form-group">
                  <label htmlFor="beneficiary">Bénéficiaire</label>
                  <select id="beneficiary" className="form-control">
                    <option>Choisir un bénéficiaire</option>
                    <option>Ahmed Ben Ali</option>
                    <option>Fatma Trabelsi</option>
                    <option>Mohamed Salah</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Montant (DT)</label>
                  <input type="number" id="amount" className="form-control" placeholder="0.00" />
                </div>
                <IonButton expand="block" className="submit-button">
                  Effectuer le virement
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </IonButton>
              </div>
            </div>

            <div className="section-card transfer-options-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={repeatOutline} />
                  Options de virement
                </h2>
              </div>
              <div className="transfer-options">
                <button className="transfer-card" onClick={() => history.push("/beneficiary-transfer")}>
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={peopleOutline} />
                  </div>
                  <div className="transfer-text">
                    <h3>Virement vers un bénéficiaire</h3>
                    <p>Effectuez un virement vers un compte bénéficiaire en toute sécurité</p>
                  </div>
                </button>

                <button className="transfer-card" onClick={() => history.push("/account-transfer")}>
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={businessOutline} />
                  </div>
                  <div className="transfer-text">
                    <h3>Virement de compte à compte</h3>
                    <p>Transférez des fonds entre vos propres comptes instantanément</p>
                  </div>
                </button>

                <button className="transfer-card" onClick={() => history.push("/scheduled-transfer")}>
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={timerOutline} />
                  </div>
                  <div className="transfer-text">
                    <h3>Virement programmé</h3>
                    <p>Planifiez des virements récurrents ou à une date future</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="section-card transfers-history-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={documentTextOutline} />
                  Historique des virements
                </h2>
                <IonSearchbar placeholder="Rechercher un virement" className="desktop-searchbar"></IonSearchbar>
              </div>
              <div className="tabs-container">
                <button
                  className={`tab-button ${activeTab === "historique" ? "active" : ""}`}
                  onClick={() => handleTabChange("historique")}
                >
                  <IonIcon icon={documentTextOutline} />
                  Historique
                </button>
                <button
                  className={`tab-button ${activeTab === "a-signer" ? "active" : ""}`}
                  onClick={() => handleTabChange("a-signer")}
                >
                  <IonIcon icon={checkmarkCircleOutline} />
                  Virements à signer
                  <IonBadge color="danger">2</IonBadge>
                </button>
              </div>

              <div className="transfers-list">
                <div className="transfer-item">
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="transfer-info">
                    <h3>Virement à Ahmed Ben Ali</h3>
                    <p>15 juillet 2023 • Compte courant</p>
                  </div>
                  <div className="transfer-amount outgoing">-1000 DT</div>
                </div>
                <div className="transfer-item">
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="transfer-info">
                    <h3>Virement reçu de Société XYZ</h3>
                    <p>10 juillet 2023 • Compte épargne</p>
                  </div>
                  <div className="transfer-amount incoming">+2500 DT</div>
                </div>
                <div className="transfer-item">
                  <IonRippleEffect />
                  <div className="transfer-icon">
                    <IonIcon icon={arrowForwardOutline} />
                  </div>
                  <div className="transfer-info">
                    <h3>Virement à Fatma Trabelsi</h3>
                    <p>5 juillet 2023 • Compte courant</p>
                  </div>
                  <div className="transfer-amount outgoing">-750 DT</div>
                </div>
              </div>
              <div className="view-all-button">
                <IonButton fill="clear">
                  Voir tous les virements
                  <IonIcon slot="end" icon={eyeOutline} />
                </IonButton>
              </div>
            </div>

            <div className="section-card summary-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={walletOutline} />
                  Résumé des virements
                </h2>
              </div>
              <div className="summary-cards">
                <div className="summary-card">
                  <IonIcon icon={trendingUpOutline} />
                  <div>
                    <h3>Total des virements ce mois</h3>
                    <p className="summary-amount">5,250 DT</p>
                  </div>
                </div>
                <div className="summary-card">
                  <IonIcon icon={repeatOutline} />
                  <div>
                    <h3>Nombre de virements</h3>
                    <p className="summary-amount">12</p>
                  </div>
                </div>
                <div className="summary-card">
                  <IonIcon icon={timerOutline} />
                  <div>
                    <h3>Prochain virement prévu</h3>
                    <p className="summary-text">Loyer - 800 DT - 01/08/2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card quick-actions-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={settingsOutline} />
                  Actions rapides
                </h2>
              </div>
              <div className="quick-actions">
                <IonButton expand="block" className="quick-action-button">
                  <IonIcon slot="start" icon={cashOutline} />
                  Nouveau virement
                </IonButton>
                <IonButton expand="block" className="quick-action-button">
                  <IonIcon slot="start" icon={repeatOutline} />
                  Gérer les virements récurrents
                </IonButton>
                <IonButton expand="block" className="quick-action-button">
                  <IonIcon slot="start" icon={documentTextOutline} />
                  Télécharger le relevé
                </IonButton>
              </div>
            </div>

            <div className="section-card help-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={helpCircleOutline} />
                  Aide et informations
                </h2>
              </div>
              <div className="help-content">
                <div className="help-item">
                  <h3>
                    <IonIcon icon={alertCircleOutline} />
                    Limites de virement
                  </h3>
                  <p>Virement quotidien max : 10,000 DT</p>
                  <p>Virement mensuel max : 50,000 DT</p>
                </div>
                <div className="help-item">
                  <h3>
                    <IonIcon icon={timerOutline} />
                    Délais de traitement
                  </h3>
                  <p>Virement interne : Instantané</p>
                  <p>Virement externe : 1-2 jours ouvrés</p>
                </div>
                <IonButton fill="clear" className="help-button">
                  Centre d'aide
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default VirementDesktop

