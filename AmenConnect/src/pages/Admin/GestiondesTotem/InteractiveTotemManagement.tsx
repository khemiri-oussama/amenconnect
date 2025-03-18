"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonPage,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
  IonModal,
  IonTextarea,
  IonAlert,
  IonInput,
} from "@ionic/react"
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  cloudUploadOutline,
  closeCircleOutline,
  saveOutline,
  checkmarkCircleOutline,
} from "ionicons/icons"
import "./InteractiveTotemManagement.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"
import KioskApprovalTab from "./kiosk-approval-tab"
import axios from "axios"

interface Totem {
  id: string
  status: "online" | "offline"
  version: string
  temperature: number
}

interface TotemFormData {
  toteId: string
  status: "online" | "offline"
  version: string
  temperature: number
  location: string
  agencyName: string
  enabled: boolean
  deviceId: string
}

const InteractiveTotemManagement: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"status" | "maintenance" | "incidents" | "register" | "approval">("status")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null)

  // Initialize kiosks from the API (empty array initially)
  const [totems, setTotems] = useState<Totem[]>([])

  // Remote maintenance state
  const [selectedMaintenanceTotem, setSelectedMaintenanceTotem] = useState<string | null>(null)
  const [selectedMaintenanceAction, setSelectedMaintenanceAction] = useState<string | null>(null)
  const [maintenanceProgress, setMaintenanceProgress] = useState<number>(0)

  // Alert state for notifications
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)

  // Register totem form state


  // Auto-generate a unique Totem ID on mount if not already set


  // Fetch kiosks from the API when the component mounts
// Fetch kiosks from the API when the component mounts
useEffect(() => {
  const fetchKiosks = async () => {
    try {
      const response = await axios.get("/api/kiosk")
      // Filter out kiosks that are not enabled
      const enabledKiosks = response.data.filter((kiosk: any) => kiosk.enabled)
      // Map the API response to match the Totem interface
      const mappedKiosks = enabledKiosks.map((kiosk: any) => ({
        id: kiosk.tote, // API returns the unique identifier as "tote"
        status: kiosk.status,
        version: kiosk.version,
        temperature: kiosk.temperature,
      }))
      setTotems(mappedKiosks)
    } catch (error) {
      console.error("Error fetching kiosks:", error)
      setAlertMessage("Erreur lors de la récupération des kiosks")
      setShowAlert(true)
    }
  }

  fetchKiosks()
}, [])


  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  // Handler for refreshing temperature for a specific totem
  const handleRefresh = async (totemId: string) => {
    try {
      const response = await axios.get("/api/kiosk/temperature")
      const newTemperature = response.data.temperature
      setTotems((prevTotems) =>
        prevTotems.map((totem) =>
          totem.id === totemId && totem.status === "online" ? { ...totem, temperature: newTemperature } : totem,
        ),
      )

    } catch (error) {
      console.error("Error refreshing temperature:", error)
      setAlertMessage(`Error refreshing Totem ${totemId}`)
      setShowAlert(true)
    }
  }

  // Handler for shutting down a totem (simulate remote shutdown)
  const handleShutdown = async (totemId: string) => {
    try {
      await axios.post("/api/kiosk/shutdown", { totemId })
      setTotems((prevTotems) =>
        prevTotems.map((totem) => (totem.id === totemId ? { ...totem, status: "offline", temperature: 0 } : totem)),
      )
      setAlertMessage(`Shutdown command sent to Totem ${totemId}`)
      setShowAlert(true)
    } catch (error) {
      console.error("Error shutting down totem:", error)
      setAlertMessage(`Error shutting down Totem ${totemId}`)
      setShowAlert(true)
    }
  }

  // Handler for executing remote maintenance action
  const handleExecuteMaintenance = async () => {
    if (!selectedMaintenanceTotem || !selectedMaintenanceAction) {
      setAlertMessage("Please select both a Totem and an Action.")
      setShowAlert(true)
      return
    }

    try {
      await axios.post("http://localhost:3000/api/kiosk/maintenance", {
        totemId: selectedMaintenanceTotem,
        action: selectedMaintenanceAction,
      })
      if (selectedMaintenanceAction === "update") {
        setMaintenanceProgress(0)
        const interval = setInterval(() => {
          setMaintenanceProgress((prev) => {
            if (prev >= 1) {
              clearInterval(interval)
              setAlertMessage(
                `Maintenance action "${selectedMaintenanceAction}" completed for Totem ${selectedMaintenanceTotem}`,
              )
              setShowAlert(true)
              return 1
            }
            return prev + 0.1
          })
        }, 500)
      } else {
        setAlertMessage(
          `Maintenance action "${selectedMaintenanceAction}" executed for Totem ${selectedMaintenanceTotem}`,
        )
        setShowAlert(true)
      }
    } catch (error) {
      console.error("Error executing maintenance action:", error)
      setAlertMessage(`Error executing maintenance action on Totem ${selectedMaintenanceTotem}`)
      setShowAlert(true)
    }
  }


  // Render the list of kiosks in the "État des Appareils" tab
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
                  <button
                    className="admin-icon-button"
                    disabled={totem.status === "offline"}
                    title="Refresh"
                    onClick={() => handleRefresh(totem.id)}
                  >
                    <IonIcon icon={refreshOutline} />
                  </button>
                  <button
                    className="admin-icon-button"
                    disabled={totem.status === "offline"}
                    title="Power"
                    onClick={() => handleShutdown(totem.id)}
                  >
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

  // Render Remote Maintenance Tab
  const renderRemoteMaintenance = () => (
    <div className="admin-maintenance-container">
      <div className="admin-form-group">
        <label className="admin-form-label">Select Totem</label>
        <div className="admin-select-wrapper">
          <IonSelect
            placeholder="Choose a totem"
            className="admin-select"
            onIonChange={(e) => setSelectedMaintenanceTotem(e.detail.value)}
          >
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
          <IonSelect
            placeholder="Choose an action"
            className="admin-select"
            onIonChange={(e) => setSelectedMaintenanceAction(e.detail.value)}
          >
            <IonSelectOption value="update">Update Software</IonSelectOption>
            <IonSelectOption value="restart">Restart Totem</IonSelectOption>
            <IonSelectOption value="diagnose">Run Diagnostics</IonSelectOption>
          </IonSelect>
        </div>
      </div>

      <button className="admin-action-button" onClick={handleExecuteMaintenance}>
        <IonIcon icon={cloudUploadOutline} />
        <span>Execute Action</span>
      </button>

      {selectedMaintenanceAction === "update" && (
        <div className="admin-progress-card">
          <h3 className="admin-progress-title">Update Progress</h3>
          <div className="admin-progress-container">
            <IonProgressBar value={maintenanceProgress} className="admin-progress-bar"></IonProgressBar>
            <span className="admin-progress-value">{Math.round(maintenanceProgress * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )

  // Render Incident Log Tab
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



  // Render Approval Tab
  const renderApprovalTab = () => <KioskApprovalTab />

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        <SidebarAdmin currentPage="Totems" />
        <div className="admin-dashboard-content">
          <AdminPageHeader
            title="Gestion des Totems Interactifs"
            subtitle="Surveillez et gérez vos totems à distance"
          />
          <div className="admin-content-card">
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
           
              <button
                className={`admin-tab ${activeTab === "approval" ? "active" : ""}`}
                onClick={() => setActiveTab("approval")}
              >
                <IonIcon icon={checkmarkCircleOutline} className="tab-icon" />
                Approbations
              </button>
            </div>
            <div className="admin-tab-content">
              {activeTab === "status" && renderDeviceStatus()}
              {activeTab === "maintenance" && renderRemoteMaintenance()}
              {activeTab === "incidents" && renderIncidentLog()}
              
              {activeTab === "approval" && renderApprovalTab()}
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

      {/* Alert for notifications */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Notification"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  )
}

export default InteractiveTotemManagement

