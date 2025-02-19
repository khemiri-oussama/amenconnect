"use client"

import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  IonSearchbar,
  IonToggle,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import {
  arrowForward,
  addCircleOutline,
  repeatOutline,
  searchOutline,
  trendingUpOutline,
  walletOutline,
  alertCircleOutline,
  moonOutline,
  sunnyOutline,
  peopleOutline,
  cardOutline,
  documentTextOutline,
  chevronForward,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../../../components/Navbar"
import "./VirementDesktop.css"
import Profile from "../accueil/MenuDesktop/ProfileMenu"
const VirementsDesktop: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("dashboard")


  const renderDashboard = () => (
    <IonGrid className="dashboard-grid">
      <IonRow>
        <IonCol size="12" sizeMd="8">
          <IonCard className="account-summary">
            <IonCardHeader>
              <IonCardSubtitle>Solde actuel</IonCardSubtitle>
              <IonCardTitle className="balance">
                <span className="amount">2,580.00</span>
                <span className="currency">DT</span>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="account-details">
                <div>
                  <IonIcon icon={walletOutline} />
                  <span>RIB: 07098050001216747468</span>
                </div>
                <div>
                  <IonIcon icon={trendingUpOutline} />
                  <span>+1,250 DT ce mois</span>
                </div>
              </div>
              <IonProgressBar value={0.7} color="success" className="balance-progress"></IonProgressBar>
              <div className="balance-info">
                <span>Solde minimum: 1,000 DT</span>
                <span>Solde maximum: 3,000 DT</span>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="recent-transactions">
            <IonCardHeader>
              <IonCardTitle>Transactions Récentes</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSearchbar placeholder="Rechercher une transaction" className="transaction-search"></IonSearchbar>
              <div className="transaction-list">
                {[...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="transaction-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IonAvatar>
                      <img src={`https://i.pravatar.cc/100?img=${index + 1}`} alt="Avatar" />
                    </IonAvatar>
                    <div className="transaction-details">
                      <h4>{index % 2 === 0 ? "Virement à Ahmed Ben Ali" : "Virement reçu de Société XYZ"}</h4>
                      <span>{index % 2 === 0 ? "Compte Epargne" : "Compte Courant"}</span>
                    </div>
                    <div className={`transaction-amount ${index % 2 === 0 ? "outgoing" : "incoming"}`}>
                      {index % 2 === 0 ? "-1,000 DT" : "+1,850 DT"}
                    </div>
                  </motion.div>
                ))}
              </div>
              <IonButton expand="block" fill="clear" className="view-all-button">
                Voir Tout l'Historique
                <IonIcon slot="end" icon={chevronForward} />
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="4">
          <IonCard className="quick-actions">
            <IonCardHeader>
              <IonCardTitle>Actions Rapides</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="actions-grid">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button">
                    <IonIcon icon={arrowForward} slot="start" />
                    Nouveau Virement
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button">
                    <IonIcon icon={repeatOutline} slot="start" />
                    Virement Permanent
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button">
                    <IonIcon icon={addCircleOutline} slot="start" />
                    Ajouter Bénéficiaire
                  </IonButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IonButton fill="clear" className="action-button">
                    <IonIcon icon={searchOutline} slot="start" />
                    Rechercher Virement
                  </IonButton>
                </motion.div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="quick-transfer">
            <IonCardHeader>
              <IonCardTitle>Virement Rapide</IonCardTitle>
            </IonCardHeader>
            
            <IonCardContent>
              <form className="quick-transfer-form">
                <IonItem>
                  <IonLabel position="floating">Bénéficiaire</IonLabel>
                  <IonSelect interface="popover">
                    <IonSelectOption value="ben1">Ahmed Ben Ali</IonSelectOption>
                    <IonSelectOption value="ben2">Société XYZ</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Montant (DT)</IonLabel>
                  <IonInput type="number" placeholder="0.00" />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Motif du virement</IonLabel>
                  <IonInput type="text" placeholder="Ex: Paiement facture" />
                </IonItem>
                <IonButton expand="block" className="transfer-button">
                  Effectuer le Virement
                  <IonIcon icon={arrowForward} slot="end" />
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>

          <IonCard className="limits-info">
            <IonCardHeader>
              <IonCardTitle>Limites et Informations</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="limits-grid">
                <div className="limit-item">
                  <IonIcon icon={walletOutline} />
                  <div>
                    <h4>Limite Quotidienne</h4>
                    <span>10,000 DT</span>
                    <IonProgressBar value={0.5} color="warning"></IonProgressBar>
                  </div>
                </div>
                <div className="limit-item">
                  <IonIcon icon={alertCircleOutline} />
                  <div>
                    <h4>Limite Mensuelle</h4>
                    <span>50,000 DT</span>
                    <IonProgressBar value={0.3} color="success"></IonProgressBar>
                  </div>
                </div>
              </div>
              <IonButton expand="block" fill="clear" className="chat-button">
                Contacter le Support
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  )

  return (
    <IonPage className={`virements-desktop`}>
      <IonHeader>
        <IonToolbar>
          <Navbar currentPage="virements" />
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
      
        <div className="tab-buttons" >
          <IonChip
            color={selectedTab === "dashboard" ? "primary" : "medium"}
            onClick={() => setSelectedTab("dashboard")}
          >
            <IonIcon icon={cardOutline} />
            Tableau de Bord
          </IonChip>
          <IonChip color={selectedTab === "history" ? "primary" : "medium"} onClick={() => setSelectedTab("history")}>
            <IonIcon icon={documentTextOutline} />
            Historique Complet
          </IonChip>
          <IonChip
            color={selectedTab === "beneficiaries" ? "primary" : "medium"}
            onClick={() => setSelectedTab("beneficiaries")}
          >
            <IonIcon icon={peopleOutline} />
            Gestion des Bénéficiaires
          </IonChip>
          
          <div className="ProfileV"><Profile/></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === "dashboard" && renderDashboard()}
            {selectedTab === "history" && <div>Historique Complet (à implémenter)</div>}
            {selectedTab === "beneficiaries" && <div>Gestion des Bénéficiaires (à implémenter)</div>}
          </motion.div>
        </AnimatePresence>
      </IonContent>
      
    </IonPage>
  )
}

export default VirementsDesktop

