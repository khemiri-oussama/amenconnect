"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { IonIcon, IonBadge, IonAlert } from "@ionic/react"
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  businessOutline,
  locationOutline,
} from "ionicons/icons"
import "./kiosk-approval-tab.css"
import axios from "axios"

interface PendingKiosk {
  _id: string
  SN: string
  status: string
  agencyName: string
  location: string
  createdAt: string
}

const KioskApprovalTab: React.FC = () => {
  const [pendingKiosks, setPendingKiosks] = useState<PendingKiosk[]>([])
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchPendingKiosks()
  }, [])

  const fetchPendingKiosks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/kiosk/pending")
      setPendingKiosks(response.data)
    } catch (error) {
      console.error("Error fetching pending kiosks:", error)
      setAlertMessage("Erreur lors de la récupération des kiosks en attente")
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveKiosk = async (kioskId: string, serialNumber: string) => {
    try {
      await axios.post("/api/kiosk/approve", { kioskId })

      // Remove the approved kiosk from the list
      setPendingKiosks((prevKiosks) => prevKiosks.filter((kiosk) => kiosk._id !== kioskId))

      setAlertMessage(`Kiosk ${serialNumber} approuvé avec succès`)
      setShowAlert(true)
    } catch (error) {
      console.error("Error approving kiosk:", error)
      setAlertMessage(`Erreur lors de l'approbation du kiosk ${serialNumber}`)
      setShowAlert(true)
    }
  }

  const handleRejectKiosk = async (kioskId: string, serialNumber: string) => {
    try {
      await axios.post("/api/kiosk/reject", { kioskId })

      // Remove the rejected kiosk from the list
      setPendingKiosks((prevKiosks) => prevKiosks.filter((kiosk) => kiosk._id !== kioskId))

      setAlertMessage(`Kiosk ${serialNumber} rejeté`)
      setShowAlert(true)
    } catch (error) {
      console.error("Error rejecting kiosk:", error)
      setAlertMessage(`Erreur lors du rejet du kiosk ${serialNumber}`)
      setShowAlert(true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="admin-approval-container">
      <div className="admin-approval-header">
        <h2 className="admin-section-title">Kiosks en attente d'approbation</h2>
        <button className="admin-refresh-button" onClick={fetchPendingKiosks}>
          Rafraîchir
        </button>
      </div>

      {isLoading ? (
        <div className="admin-loading-container">
          <div className="admin-spinner"></div>
          <p>Chargement des kiosks en attente...</p>
        </div>
      ) : pendingKiosks.length === 0 ? (
        <div className="admin-empty-state">
          <IonIcon icon={timeOutline} className="admin-empty-icon" />
          <p>Aucun kiosk en attente d'approbation</p>
        </div>
      ) : (
        <div className="admin-approval-list">
          {pendingKiosks.map((kiosk) => (
            <div key={kiosk._id} className="admin-approval-item">
              <div className="admin-approval-info">
                <div className="admin-approval-header">
                  <h3 className="admin-approval-title">{kiosk.SN}</h3>
                  <IonBadge color="warning" className="admin-approval-badge">
                    En attente
                  </IonBadge>
                </div>
                <div className="admin-approval-details">
                  <div className="admin-approval-detail">
                    <IonIcon icon={businessOutline} />
                    <span>{kiosk.agencyName}</span>
                  </div>
                  <div className="admin-approval-detail">
                    <IonIcon icon={locationOutline} />
                    <span>{kiosk.location}</span>
                  </div>
                  <div className="admin-approval-detail">
                    <IonIcon icon={timeOutline} />
                    <span>Demandé le {formatDate(kiosk.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="admin-approval-actions">
                <button className="admin-approve-button" onClick={() => handleApproveKiosk(kiosk._id, kiosk.SN)}>
                  <IonIcon icon={checkmarkCircleOutline} />
                  Approuver
                </button>
                <button className="admin-reject-button" onClick={() => handleRejectKiosk(kiosk._id, kiosk.SN)}>
                  <IonIcon icon={closeCircleOutline} />
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Notification"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </div>
  )
}

export default KioskApprovalTab

