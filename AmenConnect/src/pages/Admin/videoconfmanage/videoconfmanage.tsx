"use client"

import { useState } from "react"
import { IonPage, IonIcon, IonSearchbar, IonModal, IonToast } from "@ionic/react"
import {
  videocamOutline,
  callOutline,
  timeOutline,
  personOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  notificationsOutline,
  searchOutline,
  chatbubbleEllipsesOutline,
  copyOutline,
  linkOutline,
  peopleOutline,
} from "ionicons/icons"
import SidebarAdmin from "../../../components/sidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import JitsiMeetComponent from "./jitsi-meet"
import "./videoconfmanage.css"

// Helper function to generate a secure room ID
const generateRoomId = (length = 20) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const VideoConferenceManagement = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "history">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConference, setSelectedConference] = useState<any>(null)
  const [isJitsiOpen, setIsJitsiOpen] = useState(false)
  const [currentRoom, setCurrentRoom] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastColor, setToastColor] = useState("success")
  const [showShareModal, setShowShareModal] = useState(false)
  const [conferences, setConferences] = useState([
    {
      id: "VC001",
      clientName: "John Doe",
      clientEmail: "john@example.com",
      requestTime: "2025-03-08T10:30:00",
      status: "pending",
      subject: "Product Inquiry",
      roomId: "product-inquiry-001",
    },
    {
      id: "VC002",
      clientName: "Jane Smith",
      clientEmail: "jane@example.com",
      requestTime: "2025-03-08T11:15:00",
      status: "active",
      subject: "Technical Support",
      roomId: "tech-support-002",
    },
    {
      id: "VC003",
      clientName: "Bob Johnson",
      clientEmail: "bob@example.com",
      requestTime: "2025-03-08T09:45:00",
      status: "pending",
      subject: "Account Issues",
      roomId: "account-issues-003",
    },
    {
      id: "VC004",
      clientName: "Alice Williams",
      clientEmail: "alice@example.com",
      requestTime: "2025-03-07T14:30:00",
      status: "completed",
      subject: "Billing Question",
      roomId: "billing-question-004",
    },
    {
      id: "VC005",
      clientName: "Charlie Brown",
      clientEmail: "charlie@example.com",
      requestTime: "2025-03-07T16:00:00",
      status: "completed",
      subject: "Product Demo",
      roomId: "product-demo-005",
    },
  ])

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const filteredConferences = conferences.filter((conference) => {
    // Filter by tab
    if (activeTab === "pending" && conference.status !== "pending") return false
    if (activeTab === "active" && conference.status !== "active") return false
    if (activeTab === "history" && conference.status !== "completed") return false

    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      conference.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conference.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conference.subject.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter (only applies to history tab)
    const matchesStatus = statusFilter === "all" || conference.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleAcceptConference = (conference) => {
    setSelectedConference(conference)
    setIsModalOpen(true)
  }

  const startVideoConference = () => {
    // Close the modal
    setIsModalOpen(false)

    // Set the room ID and open Jitsi
    if (selectedConference) {
      // In a real implementation, you would update the conference status to "active"
      // via an API call to your backend

      // Generate a room ID if one doesn't exist
      const roomId = selectedConference.roomId || generateRoomId()

      // Update the conference status to active
      const updatedConferences = conferences.map((conf) => {
        if (conf.id === selectedConference.id) {
          return { ...conf, status: "active", roomId: roomId }
        }
        return conf
      })

      setConferences(updatedConferences)
      setCurrentRoom(roomId)
      setIsJitsiOpen(true)

      // Show success toast
      setToastMessage("Conférence démarrée avec succès")
      setToastColor("success")
      setShowToast(true)
    }
  }

  const joinVideoConference = (conference) => {
    setSelectedConference(conference)
    setCurrentRoom(conference.roomId)
    setIsJitsiOpen(true)
  }

  const endVideoConference = (conferenceId) => {
    // Update the conference status to completed
    const updatedConferences = conferences.map((conf) => {
      if (conf.id === conferenceId) {
        return { ...conf, status: "completed" }
      }
      return conf
    })

    setConferences(updatedConferences)

    // Close Jitsi if it's the current conference
    if (selectedConference && selectedConference.id === conferenceId) {
      setIsJitsiOpen(false)
      setCurrentRoom("")
    }

    // Show success toast
    setToastMessage("Conférence terminée avec succès")
    setToastColor("success")
    setShowToast(true)
  }

  const handleJitsiClose = () => {
    setIsJitsiOpen(false)
    setCurrentRoom("")
  }

  const copyInviteLink = () => {
    const inviteLink = `https://meet.jit.si/${currentRoom}`
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setToastMessage("Lien d'invitation copié dans le presse-papiers")
        setToastColor("success")
        setShowToast(true)
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du lien:", err)
        setToastMessage("Erreur lors de la copie du lien")
        setToastColor("danger")
        setShowToast(true)
      })
  }

  const openShareModal = () => {
    setShowShareModal(true)
  }

  const renderPendingRequests = () => (
    <div className="admin-conference-list">
      <div className="admin-filters">
        <div className="admin-search-container">
          <IonIcon icon={searchOutline} className="admin-search-icon" />
          <IonSearchbar
            className="admin-searchbar"
            placeholder="Rechercher une demande"
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          ></IonSearchbar>
        </div>
      </div>

      {filteredConferences.length > 0 ? (
        <div className="admin-conference-cards">
          {filteredConferences.map((conference) => (
            <div className="admin-conference-card" key={conference.id}>
              <div className="admin-conference-header">
                <div className="admin-conference-icon">
                  <IonIcon icon={videocamOutline} />
                </div>
                <div className="admin-conference-title">
                  <h3>{conference.subject}</h3>
                  <span className="admin-conference-id">{conference.id}</span>
                </div>
                <div className="admin-conference-badge pending">En attente</div>
              </div>
              <div className="admin-conference-details">
                <div className="admin-conference-detail">
                  <IonIcon icon={personOutline} />
                  <span>{conference.clientName}</span>
                </div>
                <div className="admin-conference-detail">
                  <IonIcon icon={timeOutline} />
                  <span>{new Date(conference.requestTime).toLocaleString()}</span>
                </div>
              </div>
              <div className="admin-conference-actions">
                <button
                  className="admin-button secondary"
                  onClick={() => {
                    // Update the conference status to declined
                    const updatedConferences = conferences.map((conf) => {
                      if (conf.id === conference.id) {
                        return { ...conf, status: "declined" }
                      }
                      return conf
                    })

                    setConferences(updatedConferences)

                    // Show notification
                    setToastMessage("Demande refusée")
                    setToastColor("warning")
                    setShowToast(true)
                  }}
                >
                  <IonIcon icon={closeCircleOutline} />
                  <span>Refuser</span>
                </button>
                <button className="admin-button primary" onClick={() => handleAcceptConference(conference)}>
                  <IonIcon icon={checkmarkCircleOutline} />
                  <span>Accepter</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-no-results">
          <div className="admin-no-results-icon">
            <IonIcon icon={videocamOutline} />
          </div>
          <h3>Aucune demande en attente</h3>
          <p>Il n'y a actuellement aucune demande de visioconférence en attente.</p>
        </div>
      )}
    </div>
  )

  const renderActiveConferences = () => (
    <div className="admin-conference-list">
      <div className="admin-filters">
        <div className="admin-search-container">
          <IonIcon icon={searchOutline} className="admin-search-icon" />
          <IonSearchbar
            className="admin-searchbar"
            placeholder="Rechercher une conférence active"
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          ></IonSearchbar>
        </div>
      </div>

      {filteredConferences.length > 0 ? (
        <div className="admin-conference-cards">
          {filteredConferences.map((conference) => (
            <div className="admin-conference-card active-card" key={conference.id}>
              <div className="admin-conference-header">
                <div className="admin-conference-icon active">
                  <IonIcon icon={callOutline} />
                </div>
                <div className="admin-conference-title">
                  <h3>{conference.subject}</h3>
                  <span className="admin-conference-id">{conference.id}</span>
                </div>
                <div className="admin-conference-badge active">En cours</div>
              </div>
              <div className="admin-conference-details">
                <div className="admin-conference-detail">
                  <IonIcon icon={personOutline} />
                  <span>{conference.clientName}</span>
                </div>
                <div className="admin-conference-detail">
                  <IonIcon icon={timeOutline} />
                  <span>Démarré à {new Date(conference.requestTime).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="admin-conference-actions">
                <button className="admin-button primary" onClick={() => joinVideoConference(conference)}>
                  <IonIcon icon={callOutline} />
                  <span>Rejoindre</span>
                </button>
                <button className="admin-button secondary" onClick={() => endVideoConference(conference.id)}>
                  <IonIcon icon={closeCircleOutline} />
                  <span>Terminer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-no-results">
          <div className="admin-no-results-icon">
            <IonIcon icon={callOutline} />
          </div>
          <h3>Aucune conférence active</h3>
          <p>Il n'y a actuellement aucune visioconférence en cours.</p>
        </div>
      )}
    </div>
  )

  const renderConferenceHistory = () => (
    <div className="admin-conference-list">
      <div className="admin-filters">
        <div className="admin-search-container">
          <IonIcon icon={searchOutline} className="admin-search-icon" />
          <IonSearchbar
            className="admin-searchbar"
            placeholder="Rechercher dans l'historique"
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          ></IonSearchbar>
        </div>
      </div>

      {filteredConferences.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Sujet</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConferences.map((conference) => (
                <tr key={conference.id}>
                  <td>{conference.id}</td>
                  <td>{conference.clientName}</td>
                  <td>{conference.subject}</td>
                  <td>{new Date(conference.requestTime).toLocaleDateString()}</td>
                  <td>15 min</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-icon-button"
                        title="Voir les détails"
                        onClick={() => {
                          setSelectedConference(conference)
                          setIsModalOpen(true)
                        }}
                      >
                        <IonIcon icon={chatbubbleEllipsesOutline} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-no-results">
          <div className="admin-no-results-icon">
            <IonIcon icon={timeOutline} />
          </div>
          <h3>Aucun historique</h3>
          <p>Il n'y a aucune visioconférence terminée dans l'historique.</p>
        </div>
      )}
    </div>
  )

  return (
    <IonPage>
      {isJitsiOpen ? (
        <div className="admin-jitsi-container">
          <div className="admin-jitsi-header">
            <button className="admin-jitsi-back-button" onClick={handleJitsiClose}>
              <IonIcon icon={closeCircleOutline} />
              <span>Quitter la conférence</span>
            </button>
            <div className="admin-jitsi-controls">
              <button className="admin-jitsi-control-button" onClick={openShareModal} title="Partager l'invitation">
                <IonIcon icon={linkOutline} />
                <span>Inviter</span>
              </button>
              <div className="admin-jitsi-room-info">
                <span className="admin-jitsi-room-name">{selectedConference?.subject || "Visioconférence"}</span>
              </div>
            </div>
          </div>
          <div className="jitsi-meet-wrapper">
            <JitsiMeetComponent
              roomName={currentRoom}
              displayName={selectedConference?.clientName ? `Admin - ${selectedConference.subject}` : "Admin"}
              email=""
              subject={selectedConference?.subject || "Visioconférence"}
              onClose={handleJitsiClose}
            />
          </div>
        </div>
      ) : (
        <div className="admin-dashboard-layout">
          {/* Sidebar Component */}
          <SidebarAdmin currentPage="Visioconférence" />

          {/* Main Content */}
          <div className="admin-dashboard-content">
            {/* Header */}
            <div className="admin-dashboard-header">
              <div className="admin-header-title">
                <h1>Gestion des Visioconférences</h1>
                <p>Gérez les demandes de visioconférence et assistez les clients</p>
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
                  className={`admin-tab ${activeTab === "pending" ? "active" : ""}`}
                  onClick={() => setActiveTab("pending")}
                >
                  <IonIcon icon={videocamOutline} />
                  <span>Demandes en attente</span>
                </button>
                <button
                  className={`admin-tab ${activeTab === "active" ? "active" : ""}`}
                  onClick={() => setActiveTab("active")}
                >
                  <IonIcon icon={callOutline} />
                  <span>Conférences actives</span>
                </button>
                <button
                  className={`admin-tab ${activeTab === "history" ? "active" : ""}`}
                  onClick={() => setActiveTab("history")}
                >
                  <IonIcon icon={timeOutline} />
                  <span>Historique</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="admin-tab-content">
                {activeTab === "pending" && renderPendingRequests()}
                {activeTab === "active" && renderActiveConferences()}
                {activeTab === "history" && renderConferenceHistory()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conference Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            {selectedConference?.status === "completed"
              ? "Détails de la conférence"
              : selectedConference?.status === "active"
                ? "Rejoindre la visioconférence"
                : "Accepter la demande de visioconférence"}
          </h2>
          <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
            <IonIcon icon={closeCircleOutline} />
          </button>
        </div>
        <div className="admin-modal-content">
          {selectedConference && (
            <div className="admin-conference-details-modal">
              <div className="admin-detail-group">
                <label>Client:</label>
                <span>{selectedConference.clientName}</span>
              </div>
              <div className="admin-detail-group">
                <label>Email:</label>
                <span>{selectedConference.clientEmail}</span>
              </div>
              <div className="admin-detail-group">
                <label>Sujet:</label>
                <span>{selectedConference.subject}</span>
              </div>
              <div className="admin-detail-group">
                <label>Demandé le:</label>
                <span>{new Date(selectedConference.requestTime).toLocaleString()}</span>
              </div>

              {selectedConference.roomId && (
                <div className="admin-detail-group">
                  <label>ID de la salle:</label>
                  <div className="admin-copy-field">
                    <span>{selectedConference.roomId}</span>
                    <button
                      className="admin-copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedConference.roomId)
                        setToastMessage("ID de la salle copié")
                        setToastColor("success")
                        setShowToast(true)
                      }}
                    >
                      <IonIcon icon={copyOutline} />
                    </button>
                  </div>
                </div>
              )}

              {selectedConference.status !== "completed" && (
                <div className="admin-conference-preview">
                  <div className="admin-video-placeholder">
                    <IonIcon icon={videocamOutline} />
                    <span>Votre caméra</span>
                  </div>
                </div>
              )}

              <div className="admin-form-actions">
                <button className="admin-button secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
                {selectedConference.status !== "completed" && (
                  <button className="admin-button primary" onClick={startVideoConference}>
                    {selectedConference.status === "active" ? "Rejoindre la conférence" : "Démarrer la conférence"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </IonModal>

      {/* Share Modal */}
      <IonModal isOpen={showShareModal} onDidDismiss={() => setShowShareModal(false)} className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Partager l'invitation</h2>
          <button className="admin-modal-close" onClick={() => setShowShareModal(false)}>
            <IonIcon icon={closeCircleOutline} />
          </button>
        </div>
        <div className="admin-modal-content">
          <div className="admin-share-content">
            <div className="admin-detail-group">
              <label>Lien d'invitation:</label>
              <div className="admin-copy-field">
                <input type="text" readOnly value={`https://meet.jit.si/${currentRoom}`} className="admin-copy-input" />
                <button className="admin-copy-button" onClick={copyInviteLink}>
                  <IonIcon icon={copyOutline} />
                </button>
              </div>
            </div>

            <div className="admin-share-instructions">
              <div className="admin-share-icon">
                <IonIcon icon={peopleOutline} />
              </div>
              <p>
                Partagez ce lien avec les personnes que vous souhaitez inviter à la conférence. Ils pourront rejoindre
                la conférence en cliquant sur le lien.
              </p>
            </div>

            <button className="admin-button primary admin-share-close-button" onClick={() => setShowShareModal(false)}>
              Fermer
            </button>
          </div>
        </div>
      </IonModal>

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color={toastColor}
        position="top"
      />
    </IonPage>
  )
}

export default VideoConferenceManagement

