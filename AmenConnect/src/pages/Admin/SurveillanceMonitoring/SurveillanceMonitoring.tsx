import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonToggle,
  IonDatetime,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonAvatar,
  IonChip,
  IonNote,
} from "@ionic/react"
import {
  mapOutline,
  listOutline,
  notificationsOutline,
  searchOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  warningOutline,
} from "ionicons/icons"
import "./SurveillanceMonitoring.css"
import NavbarAdmin from "../../../components/NavbarAdmin"
const SurveillanceMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"monitoring" | "logs" | "alerts">("monitoring")
  const [startDate, setStartDate] = useState<string | null | undefined>(null)
  const [endDate, setEndDate] = useState<string | null | undefined>(null)

  const renderMonitoring = () => (
    <div className="sm-monitoring">
      <div className="sm-map-container">
        <div className="sm-map-placeholder">Carte Interactive des Totems</div>
      </div>
      <div className="sm-transactions-stream">
        <h3 className="sm-section-title">Flux des Transactions</h3>
        <IonList className="sm-transaction-list">
          {[1, 2, 3].map((_, index) => (
            <IonItem key={index} className="sm-transaction-item">
              <IonAvatar slot="start">
                <img src={`https://picsum.photos/seed/${index}/40/40`} alt="User" />
              </IonAvatar>
              <IonLabel>
                <h2>Transaction #{1000 + index}</h2>
                <p>
                  Totem ID: TM-{100 + index} | Montant: €{50 + index * 10}.00
                </p>
              </IonLabel>
              <IonChip slot="end" color="success">
                Réussie
              </IonChip>
            </IonItem>
          ))}
        </IonList>
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="sm-logs">
      <div className="sm-log-filters">
        <IonItem className="sm-filter-item">
          <IonLabel position="floating">Date de début</IonLabel>
          <IonDatetime
            presentation="date"
            value={startDate}
            onIonChange={(e) => setStartDate(e.detail.value?.toString())}
          ></IonDatetime>
        </IonItem>
        <IonItem className="sm-filter-item">
          <IonLabel position="floating">Date de fin</IonLabel>
          <IonDatetime
            presentation="date"
            value={endDate}
            onIonChange={(e) => setEndDate(e.detail.value?.toString())}
          ></IonDatetime>
        </IonItem>
        <IonItem className="sm-filter-item">
          <IonLabel position="floating">Utilisateur</IonLabel>
          <IonInput placeholder="Nom d'utilisateur"></IonInput>
        </IonItem>
        <IonItem className="sm-filter-item">
          <IonLabel position="floating">Type d'événement</IonLabel>
          <IonSelect interface="popover">
            <IonSelectOption value="all">Tous</IonSelectOption>
            <IonSelectOption value="login">Connexion</IonSelectOption>
            <IonSelectOption value="transaction">Transaction</IonSelectOption>
            <IonSelectOption value="error">Erreur</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonButton className="sm-filter-button" expand="block">
          <IonIcon slot="start" icon={searchOutline}></IonIcon>
          Rechercher
        </IonButton>
      </div>
      <IonList className="sm-log-list">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <IonItem key={index} className="sm-log-item">
            <IonIcon
              icon={index % 2 === 0 ? checkmarkCircleOutline : alertCircleOutline}
              slot="start"
              color={index % 2 === 0 ? "success" : "warning"}
            ></IonIcon>
            <IonLabel>
              <h2>Action Critique #{index + 1}</h2>
              <p>Utilisateur: John Doe | Type: {index % 2 === 0 ? "Connexion" : "Erreur"} | Date: 01/06/2023 14:30</p>
            </IonLabel>
            <IonChip slot="end" color={index % 2 === 0 ? "success" : "warning"}>
              {index % 2 === 0 ? "Réussi" : "Attention"}
            </IonChip>
          </IonItem>
        ))}
      </IonList>
    </div>
  )

  const renderAlerts = () => (
    <div className="sm-alerts">
      <IonList className="sm-alert-list">
        <IonItem className="sm-alert-item">
          <IonIcon icon={warningOutline} slot="start" color="warning"></IonIcon>
          <IonLabel>Tentatives de connexion élevées</IonLabel>
          <IonToggle slot="end"></IonToggle>
        </IonItem>
        <IonItem className="sm-alert-item">
          <IonLabel>Seuil de tentatives (par heure)</IonLabel>
          <IonRange min={1} max={100} pin color="primary" className="sm-alert-range">
            <IonNote slot="start">1</IonNote>
            <IonNote slot="end">100</IonNote>
          </IonRange>
        </IonItem>
        <IonItem className="sm-alert-item">
          <IonIcon icon={warningOutline} slot="start" color="warning"></IonIcon>
          <IonLabel>Transactions suspectes</IonLabel>
          <IonToggle slot="end"></IonToggle>
        </IonItem>
        <IonItem className="sm-alert-item">
          <IonLabel>Montant suspect (€)</IonLabel>
          <IonInput type="number" placeholder="1000" className="sm-alert-input"></IonInput>
        </IonItem>
        <IonItem className="sm-alert-item">
          <IonIcon icon={warningOutline} slot="start" color="warning"></IonIcon>
          <IonLabel>Alerte de maintenance totem</IonLabel>
          <IonToggle slot="end"></IonToggle>
        </IonItem>
        <IonItem className="sm-alert-item">
          <IonLabel>Durée hors-ligne avant alerte (minutes)</IonLabel>
          <IonInput type="number" placeholder="30" className="sm-alert-input"></IonInput>
        </IonItem>
      </IonList>
      <IonButton expand="block" className="sm-save-alerts">
        Enregistrer les paramètres
      </IonButton>
    </div>
  )

  return (
    <IonPage>
      <IonHeader>
        <NavbarAdmin currentPage="SurveillanceMonitoring" />
      </IonHeader>
      <IonContent className="sm-content ion-padding">
        <IonCard className="sm-card">
          <IonCardHeader className="sm-card-header">
            <IonCardTitle className="sm-card-title">Surveillance et Monitoring</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="sm-card-content">
            <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as any)} className="sm-tabs">
              <IonSegmentButton value="monitoring">
                <IonIcon icon={mapOutline}></IonIcon>
                <IonLabel>Monitoring</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="logs">
                <IonIcon icon={listOutline}></IonIcon>
                <IonLabel>Journaux</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="alerts">
                <IonIcon icon={notificationsOutline}></IonIcon>
                <IonLabel>Alertes</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            {activeTab === "monitoring" && renderMonitoring()}
            {activeTab === "logs" && renderLogs()}
            {activeTab === "alerts" && renderAlerts()}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default SurveillanceMonitoring

