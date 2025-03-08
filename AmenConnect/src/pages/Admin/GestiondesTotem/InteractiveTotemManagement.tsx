"use client"

import type React from "react"
import { useState } from "react"
import { IonPage, IonIcon, IonSelect, IonSelectOption, IonProgressBar, IonModal, IonTextarea } from "@ionic/react"
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  cloudUploadOutline,
  closeCircleOutline,
  notificationsOutline,
} from "ionicons/icons"
import "./InteractiveTotemManagement.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"
const InteractiveTotemManagement: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"status" | "maintenance" | "incidents">("status")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null)

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const totems = [
    { id: "TM001", status: "online", version: "1.2.3", temperature: 42 },
    { id: "TM002", status: "offline", version: "1.2.2", temperature: 0 },
    { id: "TM003", status: "online", version: "1.2.3", temperature: 38 },
  ]

  const renderDeviceStatus = () => (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Totem ID</th>
            <th>Status</th>
            <th>Version</th>
            <th>Temperature</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {totems.map((totem) => (
            <tr key={totem.id}>
              <td>{totem.id}</td>
              <td>
                <span className={`admin-status-badge ${totem.status === "online" ? "online" : "offline"}`}>
                  {totem.status}
                </span>
              </td>
              <td>{totem.version}</td>
              <td>
                <div className="admin-temp-display">
                  <IonIcon icon={thermometerOutline} />
                  <span>{totem.status === "online" ? `${totem.temperature}°C` : "N/A"}</span>
                </div>
              </td>
              <td>
                <div className="admin-action-buttons">
                  <button className="admin-icon-button" disabled={totem.status === "offline"} title="Refresh">
                    <IonIcon icon={refreshOutline} />
                  </button>
                  <button className="admin-icon-button" disabled={totem.status === "offline"} title="Power">
                    <IonIcon icon={powerOutline} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderRemoteMaintenance = () => (
    <div className="admin-maintenance-container">
      <div className="admin-form-group">
        <label className="admin-form-label">Select Totem</label>
        <div className="admin-select-wrapper">
          <IonSelect placeholder="Choose a totem" className="admin-select">
            {totems.map((totem) => (
              <IonSelectOption key={totem.id} value={totem.id}>
                {totem.id}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Action</label>
        <div className="admin-select-wrapper">
          <IonSelect placeholder="Choose an action" className="admin-select">
            <IonSelectOption value="update">Update Software</IonSelectOption>
            <IonSelectOption value="restart">Restart Totem</IonSelectOption>
            <IonSelectOption value="diagnose">Run Diagnostics</IonSelectOption>
          </IonSelect>
        </div>
      </div>

      <button className="admin-action-button">
        <IonIcon icon={cloudUploadOutline} />
        <span>Execute Action</span>
      </button>

      <div className="admin-progress-card">
        <h3 className="admin-progress-title">Update Progress</h3>
        <div className="admin-progress-container">
          <IonProgressBar value={0.5} className="admin-progress-bar"></IonProgressBar>
          <span className="admin-progress-value">50%</span>
        </div>
      </div>
    </div>
  )

  const renderIncidentLog = () => (
    <div className="admin-incidents-container">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="admin-incident-item"
          onClick={() => {
            setSelectedTotem(`TM00${index + 1}`)
            setIsModalOpen(true)
          }}
        >
          <div className="admin-incident-icon">
            <IonIcon icon={bugOutline} />
          </div>
          <div className="admin-incident-content">
            <h3 className="admin-incident-title">Incident #{1000 + index}</h3>
            <p className="admin-incident-details">
              Totem: TM00{index + 1} | Date: {new Date().toLocaleString()}
            </p>
            <p className="admin-incident-type">Type: {index % 2 === 0 ? "Hardware Failure" : "Software Error"}</p>
          </div>
          <div className={`admin-incident-badge ${index % 2 === 0 ? "warning" : "critical"}`}>
            {index % 2 === 0 ? "Open" : "Critical"}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Totems" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <AdminPageHeader
            title="Gestion des Totems Interactifs"
            subtitle="Surveillez et gérez vos totems à distance"
          />

          {/* Main Card */}
          <div className="admin-content-card">
            {/* Tabs */}
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "status" ? "active" : ""}`}
                onClick={() => setActiveTab("status")}
              >
                État des Appareils
              </button>
              <button
                className={`admin-tab ${activeTab === "maintenance" ? "active" : ""}`}
                onClick={() => setActiveTab("maintenance")}
              >
                Maintenance à Distance
              </button>
              <button
                className={`admin-tab ${activeTab === "incidents" ? "active" : ""}`}
                onClick={() => setActiveTab("incidents")}
              >
                Journal d'Incidents
              </button>
            </div>

            {/* Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "status" && renderDeviceStatus()}
              {activeTab === "maintenance" && renderRemoteMaintenance()}
              {activeTab === "incidents" && renderIncidentLog()}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Détails de l'Incident - {selectedTotem}</h2>
          <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
            <IonIcon icon={closeCircleOutline} />
          </button>
        </div>
        <div className="admin-modal-content">
          <div className="admin-form-group">
            <label className="admin-form-label">Description de l'Incident</label>
            <IonTextarea rows={10} placeholder="Entrez les détails de l'incident ici..." className="admin-textarea" />
          </div>
          <button className="admin-action-button">Enregistrer le Rapport d'Incident</button>
        </div>
      </IonModal>
    </IonPage>
  )
}

export default InteractiveTotemManagement

