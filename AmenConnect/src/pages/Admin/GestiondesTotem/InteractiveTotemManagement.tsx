"use client"

import { useState, useEffect } from "react"
import { IonPage, IonIcon, IonModal, IonTextarea, IonAlert } from "@ionic/react"
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
} from "ionicons/icons"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"
import KioskApprovalTab from "./kiosk-approval-tab"
import MaintenanceTab from "./maintenancetab"
import axios from "axios"

interface Totem {
  id: string
  status: "online" | "offline"
  version: string
  temperature: number
  serial: string
  apiUrl: string
  location?: string
  agency?: string
}

const InteractiveTotemManagement = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"status" | "maintenance" | "incidents" | "register" | "approval">("status")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null)
  const [totems, setTotems] = useState<Totem[]>([])
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)

  // Fetch kiosks from the API when the component mounts
  useEffect(() => {
    const fetchKiosks = async () => {
      try {
        const response = await axios.get("/api/kiosk")
        const enabledKiosks = response.data.filter((kiosk: any) => kiosk.enabled)
        const mappedKiosks = enabledKiosks.map((kiosk: any) => ({
          id: kiosk.tote,
          status: kiosk.status,
          version: kiosk.version,
          temperature: kiosk.temperature,
          serial: kiosk.SN,
          apiUrl: kiosk.apiUrl,
          location: kiosk.location,
          agency: kiosk.agencyName,
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
    const totem = totems.find((t) => t.id === totemId)
    if (!totem) return

    try {
      const serialResponse = await axios.get(`${totem.apiUrl}/serial`, { timeout: 3000 })
      let newStatus: "online" | "offline" = "offline"
      if (serialResponse.status === 200 && serialResponse.data.serial_number) {
        newStatus = "online"
      }

      let newTemperature = 0
      if (newStatus === "online") {
        const tempResponse = await axios.get(`${totem.apiUrl}/temperature`, { timeout: 3000 })
        if (tempResponse.status === 200 && typeof tempResponse.data.temperature !== "undefined") {
          newTemperature = tempResponse.data.temperature
        }
      }

      setTotems((prevTotems) =>
        prevTotems.map((t) => (t.id === totemId ? { ...t, status: newStatus, temperature: newTemperature } : t)),
      )
    } catch (error) {
      console.error("Error refreshing totem info:", error)
      setAlertMessage(`Error refreshing Totem ${totemId}.`)
      setShowAlert(true)
    }
  }

  // New shutdown handler calling the kiosk's Python API using its serial number
  const handleShutdown = async (totem: Totem) => {
    try {
      const response = await axios.post("/api/kiosk/shutdown", {
        totemId: totem.id,
      })

      setTotems((prevTotems) =>
        prevTotems.map((t) => (t.id === totem.id ? { ...t, status: "offline", temperature: 0 } : t)),
      )
      setAlertMessage(response.data.message || `Shutdown command sent to Totem ${totem.id}`)
      setShowAlert(true)
    } catch (error) {
      console.error("Error shutting down totem:", error)
      setAlertMessage(`Error shutting down Totem ${totem.id}`)
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
            <th>Numéro de serie</th>
            <th>Location</th>
            <th>Agence</th>
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
              <td>{totem.serial}</td>
              <td>{totem.location || "N/A"}</td>
              <td>{totem.agency || "N/A"}</td>
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
                    onClick={() => handleShutdown(totem)}
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

  // Render Incident Log Tab (simplified for brevity)
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
              {activeTab === "maintenance" && (
                <MaintenanceTab totems={totems} setAlertMessage={setAlertMessage} setShowAlert={setShowAlert} />
              )}
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

