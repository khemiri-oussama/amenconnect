"use client"

import type React from "react"
import { useState } from "react"
import {
  IonPage,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonRange,
  IonToggle,
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
import "./surveillanceMonitoring.css"
import SidebarAdmin from "../../../components/sidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"

const SurveillanceMonitoring: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"monitoring" | "logs" | "alerts">("monitoring")
  const [startDate, setStartDate] = useState<string | null | undefined>(null)
  const [endDate, setEndDate] = useState<string | null | undefined>(null)

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const renderMonitoring = () => (
    <div className="admin-monitoring-container">
      <div className="admin-map-container">
        <div className="admin-map-placeholder">Carte Interactive des Totems</div>
      </div>

      <div className="admin-section-title">
        <h3>Flux des Transactions</h3>
      </div>

      <div className="admin-transactions-list">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="admin-transaction-item">
            <div className="admin-transaction-avatar">
              <img src={`https://picsum.photos/seed/${index}/40/40`} alt="User" />
            </div>
            <div className="admin-transaction-content">
              <div className="admin-transaction-title">Transaction #{1000 + index}</div>
              <div className="admin-transaction-details">
                Totem ID: TM-{100 + index} | Montant: €{50 + index * 10}.00
              </div>
            </div>
            <div className="admin-transaction-status success">Réussie</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="admin-logs-container">
      <div className="admin-filters">
        <div className="admin-filter-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Date de début</label>
            <div className="admin-input-wrapper">
              <IonDatetime
                presentation="date"
                value={startDate}
                onIonChange={(e) => setStartDate(e.detail.value?.toString())}
                className="admin-datetime"
              ></IonDatetime>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Date de fin</label>
            <div className="admin-input-wrapper">
              <IonDatetime
                presentation="date"
                value={endDate}
                onIonChange={(e) => setEndDate(e.detail.value?.toString())}
                className="admin-datetime"
              ></IonDatetime>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Utilisateur</label>
            <div className="admin-input-wrapper">
              <IonInput placeholder="Nom d'utilisateur" className="admin-input"></IonInput>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Type d'événement</label>
            <div className="admin-select-wrapper">
              <IonSelect interface="popover" className="admin-select">
                <IonSelectOption value="all">Tous</IonSelectOption>
                <IonSelectOption value="login">Connexion</IonSelectOption>
                <IonSelectOption value="transaction">Transaction</IonSelectOption>
                <IonSelectOption value="error">Erreur</IonSelectOption>
              </IonSelect>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-button primary">
            <IonIcon icon={searchOutline} />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Statut</th>
              <th>Action</th>
              <th>Utilisateur</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="admin-log-status">
                    <IonIcon
                      icon={index % 2 === 0 ? checkmarkCircleOutline : alertCircleOutline}
                      color={index % 2 === 0 ? "success" : "warning"}
                      className="admin-log-icon"
                    />
                  </div>
                </td>
                <td>Action Critique #{index + 1}</td>
                <td>John Doe</td>
                <td>
                  <span className={`admin-status-badge ${index % 2 === 0 ? "actif" : "inactif"}`}>
                    {index % 2 === 0 ? "Connexion" : "Erreur"}
                  </span>
                </td>
                <td>01/06/2023 14:30</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderAlerts = () => (
    <div className="admin-form-container">
      <div className="admin-alerts-list">
        <div className="admin-alert-group">
          <div className="admin-security-item">
            <div className="admin-security-label">
              <IonIcon icon={warningOutline} className="admin-alert-icon warning" />
              <span>Tentatives de connexion élevées</span>
            </div>
            <IonToggle className="admin-toggle" />
          </div>

          <div className="admin-form-group range-group">
            <label className="admin-form-label">Seuil de tentatives (par heure)</label>
            <div className="admin-range-wrapper">
              <IonRange min={1} max={100} pin className="admin-range">
                <IonNote slot="start">1</IonNote>
                <IonNote slot="end">100</IonNote>
              </IonRange>
            </div>
          </div>
        </div>

        <div className="admin-alert-group">
          <div className="admin-security-item">
            <div className="admin-security-label">
              <IonIcon icon={warningOutline} className="admin-alert-icon warning" />
              <span>Transactions suspectes</span>
            </div>
            <IonToggle className="admin-toggle" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Montant suspect (€)</label>
            <div className="admin-input-wrapper">
              <IonInput type="number" placeholder="1000" className="admin-input"></IonInput>
            </div>
          </div>
        </div>

        <div className="admin-alert-group">
          <div className="admin-security-item">
            <div className="admin-security-label">
              <IonIcon icon={warningOutline} className="admin-alert-icon warning" />
              <span>Alerte de maintenance totem</span>
            </div>
            <IonToggle className="admin-toggle" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Durée hors-ligne avant alerte (minutes)</label>
            <div className="admin-input-wrapper">
              <IonInput type="number" placeholder="30" className="admin-input"></IonInput>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-button primary">
          <span>Enregistrer les paramètres</span>
        </button>
      </div>
    </div>
  )

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Surveillance" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <div className="admin-dashboard-header">
            <div className="admin-header-title">
              <h1>Surveillance et Monitoring</h1>
              <p>Suivez les activités et configurez les alertes du système</p>
            </div>
            <div className="admin-header-actions">
              <div className="admin-notification-badge">
                <IonIcon icon={notificationsOutline} className="admin-header-icon" />
                <span className="admin-badge">3</span>
              </div>
              <div className="admin-profile-menu">
                <div className="admin-profile-avatar">
                  <span>A</span>
                </div>
                <span className="admin-profile-name">Admin</span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="admin-content-card">
            {/* Tabs */}
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "monitoring" ? "active" : ""}`}
                onClick={() => setActiveTab("monitoring")}
              >
                <IonIcon icon={mapOutline} />
                <span>Monitoring</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "logs" ? "active" : ""}`}
                onClick={() => setActiveTab("logs")}
              >
                <IonIcon icon={listOutline} />
                <span>Journaux</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "alerts" ? "active" : ""}`}
                onClick={() => setActiveTab("alerts")}
              >
                <IonIcon icon={notificationsOutline} />
                <span>Alertes</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "monitoring" && renderMonitoring()}
              {activeTab === "logs" && renderLogs()}
              {activeTab === "alerts" && renderAlerts()}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  )
}

export default SurveillanceMonitoring

