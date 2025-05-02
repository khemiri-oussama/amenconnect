"use client"

import { useState, useEffect, useRef } from "react"
import { IonPage, IonIcon, IonModal, IonTextarea, IonAlert,IonButton } from "@ionic/react"
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
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
  const [incidentDescription, setIncidentDescription] = useState<string>("")
  const [incidents, setIncidents] = useState<any[]>([])

  // Use a ref to track which totems have already been logged as offline.
  const loggedIncidentsRef = useRef<{ [totemId: string]: boolean }>({})
  interface InteractiveTotemManagementProps {
    totemId: string;
    onClose: () => void;
  }
  
  // Add a close button in your InteractiveTotemManagement component
  const InteractiveTotemManagement: React.FC<InteractiveTotemManagementProps> = ({ totemId, onClose }) => {
    return (
      <div className="management-view">
        <div className="management-header">
          <h2>Gestion du Totem {totemId}</h2>
          <IonButton fill="clear" onClick={onClose}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </div>
        {/* Rest of your management UI */}
      </div>
    );
  };
  // Periodically check each totem and log an incident if offline and not already logged.
  // Using a ref here prevents unnecessary re-creation of the effect.
  useEffect(() => {
    const interval = setInterval(() => {
      totems.forEach(async (totem) => {
        if (totem.status === "offline" && !loggedIncidentsRef.current[totem.id]) {
          await logIncident(totem.id, "Hardware Failure", "Totem is offline.")
          loggedIncidentsRef.current[totem.id] = true
        }
        if (totem.status === "online" && loggedIncidentsRef.current[totem.id]) {
          delete loggedIncidentsRef.current[totem.id]
        }
      })
    }, 20000) // Check every 20 seconds (adjust as needed)

    return () => clearInterval(interval)
  }, [totems])

  // Fetch kiosks from the API on mount
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

  // Fetch incidents when the incidents tab is active
  useEffect(() => {
    if (activeTab === "incidents") {
      const fetchIncidents = async () => {
        try {
          const response = await axios.get("/api/incidents")
          setIncidents(response.data)
        } catch (error) {
          console.error("Error fetching incidents:", error)
        }
      }
      fetchIncidents()
    }
  }, [activeTab])

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  // Function to log an incident to the backend
  const logIncident = async (totemId: string, type: string, description: string) => {
    try {
      await axios.post("/api/incidents", { totemId, type, description })
    } catch (error) {
      console.error("Error logging incident", error)
    }
  }

  // Handler to refresh a totem’s status and temperature
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

      // Log incident if conditions are met
      if (newStatus === "offline") {
        await logIncident(totem.id, "Hardware Failure", "Totem is offline.")
      } else if (newTemperature === 0) {
        await logIncident(totem.id, "Hardware Failure", "Temperature reading is null or 0°C.")
      }

      setTotems((prevTotems) =>
        prevTotems.map((t) => (t.id === totemId ? { ...t, status: newStatus, temperature: newTemperature } : t))
      )
    } catch (error) {
      console.error("Error refreshing totem info:", error)
      setAlertMessage(`Error refreshing Totem ${totemId}.`)
      setShowAlert(true)
    }
  }

  // Handler to shutdown a totem
  const handleShutdown = async (totem: Totem) => {
    try {
      const response = await axios.post("/api/kiosk/shutdown", {
        totemId: totem.id,
      })

      // After shutdown, mark as offline and log an incident
      setTotems((prevTotems) =>
        prevTotems.map((t) => (t.id === totem.id ? { ...t, status: "offline", temperature: 0 } : t))
      )
      await logIncident(totem.id, "Hardware Failure", "Totem shutdown command executed; device is now offline.")
      setAlertMessage(response.data.message || `Shutdown command sent to Totem ${totem.id}`)
      setShowAlert(true)
    } catch (error) {
      console.error("Error shutting down totem:", error)
      setAlertMessage(`Error shutting down Totem ${totem.id}`)
      setShowAlert(true)
    }
  }

  // Submit the incident report from the modal (manual incident reporting)
  const submitIncidentReport = async () => {
    if (!selectedTotem || incidentDescription.trim() === "") {
      setAlertMessage("Please provide a description for the incident.")
      setShowAlert(true)
      return
    }
    try {
      await axios.post("/api/incidents", {
        totemId: selectedTotem,
        type: "Other",
        description: incidentDescription,
      })
      setAlertMessage("Incident report submitted successfully.")
      setShowAlert(true)
      // Refresh incidents list if the tab is active
      if (activeTab === "incidents") {
        const response = await axios.get("/api/incidents")
        setIncidents(response.data)
      }
      setIsModalOpen(false)
      setIncidentDescription("")
    } catch (error) {
      console.error("Error submitting incident report:", error)
      setAlertMessage("Error submitting incident report.")
      setShowAlert(true)
    }
  }

  // Handler to mark an incident as fixed (delete it from the backend and update the state)
  const handleFixIncident = async (incidentId: string) => {
    try {
      await axios.delete(`/api/incidents/${incidentId}`)
      setIncidents((prev) => prev.filter((incident) => incident._id !== incidentId))
      setAlertMessage("Incident marked as fixed and removed.")
      setShowAlert(true)
    } catch (error) {
      console.error("Error fixing incident:", error)
      setAlertMessage("Error marking incident as fixed.")
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
                  <button className="admin-icon-button" title="Refresh" onClick={() => handleRefresh(totem.id)} disabled={totem.status === "offline"}>
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

  // Render Incident Log Tab with a "Fixed" button for each incident
  const renderIncidentLog = () => (
    <div className="admin-incidents-container">
      {incidents.length === 0 ? (
        <p>Aucun incident n'a été signalé.</p>
      ) : (
        incidents.map((incident, index) => (
          <div
            key={index}
            className={`admin-incident-item ${incident.type === "Hardware Failure" ? "warning" : "critical"}`}
          >
            <div className="admin-incident-icon">
              <IonIcon icon={bugOutline} />
            </div>
            <div
              className="admin-incident-content"
              onClick={() => {
                setSelectedTotem(incident.totemId)
                setIsModalOpen(true)
              }}
            >
              <h3 className="admin-incident-title">Incident - {incident.totemId}</h3>
              <p className="admin-incident-details">
                Date: {new Date(incident.createdAt).toLocaleString()}
              </p>
              <p className="admin-incident-type">Type: {incident.type}</p>
              <p className="admin-incident-description">{incident.description}</p>
            </div>
            <div className="admin-incident-actions">
              <button className="admin-action-button" onClick={() => handleFixIncident(incident._id)}>
                Fixed
              </button>
            </div>
          </div>
        ))
      )}
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
              <button className={`admin-tab ${activeTab === "status" ? "active" : ""}`} onClick={() => setActiveTab("status")}>
                État des Appareils
              </button>
              <button className={`admin-tab ${activeTab === "maintenance" ? "active" : ""}`} onClick={() => setActiveTab("maintenance")}>
                Maintenance à Distance
              </button>
              <button className={`admin-tab ${activeTab === "incidents" ? "active" : ""}`} onClick={() => setActiveTab("incidents")}>
                Journal d'Incidents
              </button>
              <button className={`admin-tab ${activeTab === "approval" ? "active" : ""}`} onClick={() => setActiveTab("approval")}>
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
            <IonTextarea
              rows={10}
              placeholder="Entrez les détails de l'incident ici..."
              className="admin-textarea"
              value={incidentDescription}
              onIonChange={(e) => setIncidentDescription(e.detail.value!)}
            />
          </div>
          <button className="admin-action-button" onClick={submitIncidentReport}>
            Enregistrer le Rapport d'Incident
          </button>
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
