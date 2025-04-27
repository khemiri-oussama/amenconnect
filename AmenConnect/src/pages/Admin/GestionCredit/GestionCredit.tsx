"use client"

import { useState, useEffect } from "react"
import {
  IonPage,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonBadge,
} from "@ionic/react"
import {
  cashOutline,
  filterOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  documentTextOutline,
  eyeOutline,
  chevronDownOutline,
  chevronUpOutline,
  timeOutline,
  walletOutline,
  cardOutline,
  personOutline,
  calendarOutline,
} from "ionicons/icons"
import axios from "axios"
import "./GestionCredit.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import AdminPageHeader from "../adminpageheader"

interface Credit {
  _id: string
  userId: {
    _id: string
    prenom: string
    nom: string
    email: string
  }
  compteId: {
    _id: string
    numéroCompte: string
    type: string
  }
  type: string
  montant: number
  duree: number
  RevenuMensuel: number
  tauxInteret: number
  mensualite: number
  dateDebut: string
  dateFin: string
  status: string
  createdAt: string
}

const GestionCredit = () => {
  const [credits, setCredits] = useState<Credit[]>([])
  const [filteredCredits, setFilteredCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    fetchCredits()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [credits, searchText, statusFilter, typeFilter, sortField, sortDirection])

  const fetchCredits = async () => {
    setLoading(true)
    try {
      const response = await axios.get<Credit[]>('/api/credit/all')
      setCredits(response.data)
      setFilteredCredits(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits:', error)
      // Optionnel : afficher un message d'erreur à l'utilisateur
      setCredits([])
      setFilteredCredits([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...credits]

    // Recherche
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      result = result.filter(
        credit =>
          credit.userId.nom.toLowerCase().includes(searchLower) ||
          credit.userId.prenom.toLowerCase().includes(searchLower) ||
          credit.userId.email.toLowerCase().includes(searchLower) ||
          credit.compteId.numéroCompte.toLowerCase().includes(searchLower) ||
          credit._id.toLowerCase().includes(searchLower)
      )
    }

    // Filtre statut
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter)
    }

    // Filtre type
    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter)
    }

    // Tri
    result.sort((a, b) => {
      let comp = 0
      switch (sortField) {
        case 'montant': comp = a.montant - b.montant; break
        case 'duree': comp = a.duree - b.duree; break
        case 'mensualite': comp = a.mensualite - b.mensualite; break
        default:
          comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDirection === 'asc' ? comp : -comp
    })

    setFilteredCredits(result)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }


  const confirmStatusAction = async () => {
    if (!selectedCredit) return
    const status = actionType === 'approve' ? 'approved' : 'rejected'
    const payload: any = { status }
    if (status === 'rejected') payload.rejectionReason = rejectionReason
    try {
      const { data } = await axios.patch(`/api/credit/${selectedCredit._id}/status`, payload)
      const updated = data.credit || data
      setCredits(cs => cs.map(c => c._id === updated._id ? updated : c))
    } catch (e) {
      console.error(e)
    } finally {
      setShowConfirmModal(false)
      setShowModal(false)
    }
  }


  const viewCreditDetails = (credit: Credit) => {
    setSelectedCredit(credit)
    setShowModal(true)
  }

  const handleStatusAction = (credit: Credit, action: string) => {
    setSelectedCredit(credit)
    setActionType(action)
    setRejectionReason("")
    setShowConfirmModal(true)
  }



  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <IonBadge className="status-badge approved">Approuvé</IonBadge>
      case "rejected":
        return <IonBadge className="status-badge rejected">Rejeté</IonBadge>
      case "pending":
        return <IonBadge className="status-badge pending">En attente</IonBadge>
      case "received":
        return <IonBadge className="status-badge received">Reçu</IonBadge>
      default:
        return <IonBadge className="status-badge">{status}</IonBadge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        <SidebarAdmin currentPage="Gestion Crédit" />
        <div className="admin-dashboard-content">
          <AdminPageHeader title="Gestion des Crédits" subtitle="Gérez les demandes de crédit des clients" />

          {/* Filters and Search */}
          <div className="credit-filters">
            <div className="credit-search">
              <IonSearchbar
                value={searchText}
                onIonChange={(e) => setSearchText(e.detail.value || "")}
                placeholder="Rechercher par nom, email, numéro de compte..."
                className="credit-searchbar"
              />
            </div>
            <div className="credit-filter-options">
              <div className="filter-group">
                <IonIcon icon={filterOutline} className="filter-icon" />
                <IonSelect
                  interface="popover"
                  value={statusFilter}
                  onIonChange={(e) => setStatusFilter(e.detail.value)}
                  placeholder="Statut"
                  className="credit-select"
                >
                  <IonSelectOption value="all">Tous les statuts</IonSelectOption>
                  <IonSelectOption value="pending">En attente</IonSelectOption>
                  <IonSelectOption value="approved">Approuvé</IonSelectOption>
                  <IonSelectOption value="rejected">Rejeté</IonSelectOption>
                  <IonSelectOption value="received">Reçu</IonSelectOption>
                </IonSelect>
              </div>
              <div className="filter-group">
                <IonIcon icon={cashOutline} className="filter-icon" />
                <IonSelect
                  interface="popover"
                  value={typeFilter}
                  onIonChange={(e) => setTypeFilter(e.detail.value)}
                  placeholder="Type"
                  className="credit-select"
                >
                  <IonSelectOption value="all">Tous les types</IonSelectOption>
                  <IonSelectOption value="Auto">Auto</IonSelectOption>
                  <IonSelectOption value="Immobilier">Immobilier</IonSelectOption>
                  <IonSelectOption value="Études">Études</IonSelectOption>
                  <IonSelectOption value="Liquidité">Liquidité</IonSelectOption>
                </IonSelect>
              </div>
            </div>
          </div>

          {/* Credits Table */}
          <div className="credit-table-container">
            {loading ? (
              <div className="credit-loading">Chargement des données...</div>
            ) : filteredCredits.length === 0 ? (
              <div className="credit-empty">Aucune demande de crédit trouvée</div>
            ) : (
              <table className="credit-table">
                <thead>
                  <tr>
                    <th className="id-column">ID</th>
                    <th className="client-column">Client</th>
                    <th className="type-column">Type</th>
                    <th onClick={() => handleSort("montant")} className="sortable-header amount-column">
                      <span>Montant</span>
                      {sortField === "montant" && (
                        <IonIcon icon={sortDirection === "asc" ? chevronUpOutline : chevronDownOutline} />
                      )}
                    </th>
                    <th onClick={() => handleSort("duree")} className="sortable-header duration-column">
                      <span>Durée (mois)</span>
                      {sortField === "duree" && (
                        <IonIcon icon={sortDirection === "asc" ? chevronUpOutline : chevronDownOutline} />
                      )}
                    </th>
                    <th onClick={() => handleSort("mensualite")} className="sortable-header monthly-column">
                      <span>Mensualité</span>
                      {sortField === "mensualite" && (
                        <IonIcon icon={sortDirection === "asc" ? chevronUpOutline : chevronDownOutline} />
                      )}
                    </th>
                    <th onClick={() => handleSort("createdAt")} className="sortable-header date-column">
                      <span>Date de demande</span>
                      {sortField === "createdAt" && (
                        <IonIcon icon={sortDirection === "asc" ? chevronUpOutline : chevronDownOutline} />
                      )}
                    </th>
                    <th className="status-column">Statut</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCredits.map((credit) => (
                    <tr key={credit._id} className={`credit-row status-${credit.status}`}>
                      <td className="credit-id">{credit._id.substring(0, 8)}...</td>
                      <td className="credit-client">
                        <div className="client-name">
                          {credit.userId.prenom} {credit.userId.nom}
                        </div>
                        <div className="client-email">{credit.userId.email}</div>
                      </td>
                      <td className="credit-type">{credit.type}</td>
                      <td className="credit-amount">{formatCurrency(credit.montant)}</td>
                      <td className="credit-duration">{credit.duree}</td>
                      <td className="credit-monthly">{formatCurrency(credit.mensualite)}</td>
                      <td className="credit-date">{formatDate(credit.createdAt)}</td>
                      <td className="credit-status">{getStatusBadge(credit.status)}</td>
                      <td className="credit-actions">
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => viewCreditDetails(credit)}
                          className="action-button view"
                        >
                          <IonIcon icon={eyeOutline} />
                        </IonButton>
                        {credit.status === "pending" && (
                          <>
                            <IonButton
                              fill="clear"
                              size="small"
                              onClick={() => handleStatusAction(credit, "approve")}
                              className="action-button approve"
                            >
                              <IonIcon icon={checkmarkCircleOutline} />
                            </IonButton>
                            <IonButton
                              fill="clear"
                              size="small"
                              onClick={() => handleStatusAction(credit, "reject")}
                              className="action-button reject"
                            >
                              <IonIcon icon={closeCircleOutline} />
                            </IonButton>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Credit Details Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="credit-modal">
            <div className="credit-modal-content">
              <div className="credit-modal-header">
                <h2>Détails de la demande de crédit</h2>
                <IonButton fill="clear" onClick={() => setShowModal(false)} className="close-button">
                  <IonIcon icon={closeCircleOutline} />
                </IonButton>
              </div>

              {selectedCredit && (
                <div className="credit-details">
                  <div className="credit-detail-section">
                    <h3>Informations générales</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={documentTextOutline} />
                          ID de la demande
                        </div>
                        <div className="detail-value">{selectedCredit._id}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={cashOutline} />
                          Type de crédit
                        </div>
                        <div className="detail-value">{selectedCredit.type}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={timeOutline} />
                          Statut
                        </div>
                        <div className="detail-value">{getStatusBadge(selectedCredit.status)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={calendarOutline} />
                          Date de demande
                        </div>
                        <div className="detail-value">{formatDate(selectedCredit.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="credit-detail-section">
                    <h3>Informations du client</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={personOutline} />
                          Nom complet
                        </div>
                        <div className="detail-value">
                          {selectedCredit.userId.prenom} {selectedCredit.userId.nom}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={personOutline} />
                          Email
                        </div>
                        <div className="detail-value">{selectedCredit.userId.email}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={walletOutline} />
                          Revenu mensuel
                        </div>
                        <div className="detail-value">{formatCurrency(selectedCredit.RevenuMensuel)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={cardOutline} />
                          Numéro de compte
                        </div>
                        <div className="detail-value">{selectedCredit.compteId.numéroCompte}</div>
                      </div>
                    </div>
                  </div>

                  <div className="credit-detail-section">
                    <h3>Détails financiers</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={cashOutline} />
                          Montant du crédit
                        </div>
                        <div className="detail-value">{formatCurrency(selectedCredit.montant)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={timeOutline} />
                          Durée (mois)
                        </div>
                        <div className="detail-value">{selectedCredit.duree}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={cashOutline} />
                          Taux d'intérêt
                        </div>
                        <div className="detail-value">{selectedCredit.tauxInteret}%</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={cashOutline} />
                          Mensualité
                        </div>
                        <div className="detail-value">{formatCurrency(selectedCredit.mensualite)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={calendarOutline} />
                          Date de début
                        </div>
                        <div className="detail-value">{formatDate(selectedCredit.dateDebut)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">
                          <IonIcon icon={calendarOutline} />
                          Date de fin
                        </div>
                        <div className="detail-value">{formatDate(selectedCredit.dateFin)}</div>
                      </div>
                    </div>
                  </div>

                  {selectedCredit.status === "pending" && (
                    <div className="credit-actions-container">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={() => handleStatusAction(selectedCredit, "approve")}
                        className="action-button-large"
                      >
                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                        Approuver la demande
                      </IonButton>
                      <IonButton
                        expand="block"
                        color="danger"
                        onClick={() => handleStatusAction(selectedCredit, "reject")}
                        className="action-button-large"
                      >
                        <IonIcon icon={closeCircleOutline} slot="start" />
                        Rejeter la demande
                      </IonButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </IonModal>

          {/* Confirmation Modal */}
          <IonModal isOpen={showConfirmModal} onDidDismiss={() => setShowConfirmModal(false)} className="confirm-modal">
            <div className="confirm-modal-content">
              <div className="confirm-modal-header">
                <h2>{actionType === "approve" ? "Approuver la demande" : "Rejeter la demande"}</h2>
                <IonButton fill="clear" onClick={() => setShowConfirmModal(false)} className="close-button">
                  <IonIcon icon={closeCircleOutline} />
                </IonButton>
              </div>

              <div className="confirm-modal-body">
                {actionType === "approve" ? (
                  <p>Êtes-vous sûr de vouloir approuver cette demande de crédit ?</p>
                ) : (
                  <>
                    <p>Êtes-vous sûr de vouloir rejeter cette demande de crédit ?</p>
                    <IonItem className="rejection-reason">
                      <IonLabel position="stacked">Motif du rejet</IonLabel>
                      <IonInput
                        value={rejectionReason}
                        onIonChange={(e) => setRejectionReason(e.detail.value || "")}
                        placeholder="Veuillez indiquer le motif du rejet"
                      />
                    </IonItem>
                  </>
                )}
              </div>

              <div className="confirm-modal-footer">
                <IonButton fill="outline" onClick={() => setShowConfirmModal(false)} className="cancel-button">
                  Annuler
                </IonButton>
                <IonButton
                  color={actionType === "approve" ? "success" : "danger"}
                  onClick={confirmStatusAction}
                  disabled={actionType === "reject" && !rejectionReason}
                  className="confirm-button"
                >
                  Confirmer
                </IonButton>
              </div>
            </div>
          </IonModal>
        </div>
      </div>
    </IonPage>
  )
}

export default GestionCredit
