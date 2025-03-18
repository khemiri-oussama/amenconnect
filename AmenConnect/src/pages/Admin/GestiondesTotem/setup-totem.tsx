"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  IonPage,
  IonIcon,
  IonAlert,
  IonModal,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonContent,
} from "@ionic/react"
import { checkmarkCircleOutline, closeCircleOutline, searchOutline, informationCircleOutline } from "ionicons/icons"
import axios from "axios"
import "./InteractiveTotemManagement.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"

interface PendingTotem {
  id: string
  deviceId: string
  location: string
  agencyName: string
  status: "online" | "offline"
  version: string
  temperature: number
  enabled: boolean
  requestDate: string
}

const SetupTotem: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [pendingTotems, setPendingTotems] = useState<PendingTotem[]>([])
  const [selectedTotem, setSelectedTotem] = useState<PendingTotem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch pending totems (with enabled=false) from the API when the component mounts
  useEffect(() => {
    const fetchPendingTotems = async () => {
      try {
        setLoading(true)
        // Modify this endpoint to match your API
        const response = await axios.get("/api/kiosk/pending")
        setPendingTotems(response.data)
      } catch (error) {
        console.error("Error fetching pending totems:", error)
        setAlertMessage("Erreur lors de la récupération des totems en attente")
        setShowAlert(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingTotems()
  }, [])

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  // Generate a unique Totem ID
  const generateTotemId = () => {
    return "TM" + Math.floor(1000 + Math.random() * 9000)
  }

  // Handle approving a totem setup request
  const handleApproveTotem = async () => {
    if (!selectedTotem) return

    try {
      const totemId = generateTotemId()

      // Update the totem in the database
      await axios.put(`/api/kiosk/${selectedTotem.id}`, {
        toteId: totemId,
        enabled: true,
      })

      // Update local state
      setPendingTotems((prevTotems) => prevTotems.filter((totem) => totem.id !== selectedTotem.id))

      setAlertMessage(`Totem approuvé avec succès. ID attribué: ${totemId}`)
      setShowAlert(true)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error approving totem:", error)
      setAlertMessage("Erreur lors de l'approbation du totem")
      setShowAlert(true)
    }
  }

  // Handle rejecting a totem setup request
  const handleRejectTotem = async () => {
    if (!selectedTotem) return

    try {
      // Delete the totem from the database or mark it as rejected
      await axios.delete(`/api/kiosk/${selectedTotem.id}`)

      // Update local state
      setPendingTotems((prevTotems) => prevTotems.filter((totem) => totem.id !== selectedTotem.id))

      setAlertMessage("Demande de totem rejetée")
      setShowAlert(true)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error rejecting totem:", error)
      setAlertMessage("Erreur lors du rejet du totem")
      setShowAlert(true)
    }
  }

  // Open the inspection modal for a totem
  const openInspectionModal = (totem: PendingTotem) => {
    setSelectedTotem(totem)
    setIsModalOpen(true)
  }

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        <SidebarAdmin currentPage="Totems" />
        <div className="admin-dashboard-content">
          <AdminPageHeader
            title="Configuration des Totems"
            subtitle="Approuvez les demandes de configuration des totems"
          />
          <div className="admin-content-card">
            <div className="admin-tab-content">
              <div className="admin-setup-container">
                <div className="admin-setup-header">
                  <h2 className="admin-setup-title">Totems en attente d'approbation</h2>
                  <p className="admin-setup-description">
                    Inspectez et approuvez les demandes de configuration des totems
                  </p>
                </div>

                {loading ? (
                  <div className="admin-loading-container">
                    <div className="admin-loading-spinner"></div>
                    <p>Chargement des totems en attente...</p>
                  </div>
                ) : pendingTotems.length === 0 ? (
                  <div className="admin-empty-state">
                    <div className="admin-empty-icon">
                      <IonIcon icon={informationCircleOutline} />
                    </div>
                    <h3>Aucun totem en attente</h3>
                    <p>Toutes les demandes de configuration ont été traitées</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Device ID</th>
                          <th>Emplacement</th>
                          <th>Agence</th>
                          <th>Date de demande</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingTotems.map((totem) => (
                          <tr key={totem.id}>
                            <td>{totem.deviceId}</td>
                            <td>{totem.location || "Non spécifié"}</td>
                            <td>{totem.agencyName || "Non spécifié"}</td>
                            <td>{new Date(totem.requestDate).toLocaleDateString()}</td>
                            <td>
                              <div className="admin-action-buttons">
                                <button
                                  className="admin-icon-button admin-inspect-button"
                                  title="Inspecter"
                                  onClick={() => openInspectionModal(totem)}
                                >
                                  <IonIcon icon={searchOutline} />
                                  <span>Inspecter</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Inspection de la demande de configuration</h2>
          <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
            <IonIcon icon={closeCircleOutline} />
          </button>
        </div>
        <IonContent className="admin-modal-content">
          {selectedTotem && (
            <div className="admin-inspection-details">
              <div className="admin-inspection-section">
                <h3 className="admin-section-title">Informations de l'appareil</h3>
                <IonList lines="full">
                  <IonItem>
                    <IonLabel>
                      <h2>Device ID</h2>
                      <p>{selectedTotem.deviceId}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Version</h2>
                      <p>{selectedTotem.version}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Status</h2>
                    </IonLabel>
                    <IonBadge color={selectedTotem.status === "online" ? "success" : "danger"} slot="end">
                      {selectedTotem.status}
                    </IonBadge>
                  </IonItem>
                </IonList>
              </div>

              <div className="admin-inspection-section">
                <h3 className="admin-section-title">Informations de localisation</h3>
                <IonList lines="full">
                  <IonItem>
                    <IonLabel>
                      <h2>Emplacement</h2>
                      <p>{selectedTotem.location || "Non spécifié"}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Agence</h2>
                      <p>{selectedTotem.agencyName || "Non spécifié"}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </div>

              <div className="admin-inspection-section">
                <h3 className="admin-section-title">Date de la demande</h3>
                <p className="admin-date-display">{new Date(selectedTotem.requestDate).toLocaleString()}</p>
              </div>

              <div className="admin-inspection-actions">
                <IonButton expand="block" color="success" onClick={handleApproveTotem} className="admin-approve-button">
                  <IonIcon icon={checkmarkCircleOutline} slot="start" />
                  Approuver et attribuer un ID
                </IonButton>
                <IonButton expand="block" color="danger" onClick={handleRejectTotem} className="admin-reject-button">
                  <IonIcon icon={closeCircleOutline} slot="start" />
                  Rejeter la demande
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
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

export default SetupTotem

