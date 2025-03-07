"use client"

import type React from "react"
import { useState } from "react"
import { IonPage, IonIcon, IonInput, IonSelect, IonSelectOption, IonSearchbar } from "@ionic/react"
import {
  peopleOutline,
  personAddOutline,
  keyOutline,
  createOutline,
  trashOutline,
  notificationsOutline,
  searchOutline,
  filterOutline,
} from "ionicons/icons"
import "./UserManagement.css"
import SidebarAdmin from "../../../components/sidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"

const UserManagement: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"list" | "create" | "reset">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const users = [
    { name: "John Doe", email: "john@example.com", role: "Client", status: "Actif" },
    { name: "Jane Smith", email: "jane@example.com", role: "Employé", status: "Actif" },
    { name: "Bob Johnson", email: "bob@example.com", role: "Admin", status: "Inactif" },
    { name: "Alice Williams", email: "alice@example.com", role: "Client", status: "Actif" },
    { name: "Charlie Brown", email: "charlie@example.com", role: "Employé", status: "Inactif" },
  ]

  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Role filter
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    // Status filter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesRole && matchesStatus
  })

  const renderUserList = () => (
    <div className="admin-user-list">
      <div className="admin-filters">
        <div className="admin-search-container">
          <IonIcon icon={searchOutline} className="admin-search-icon" />
          <IonSearchbar
            className="admin-searchbar"
            placeholder="Rechercher un utilisateur"
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          ></IonSearchbar>
        </div>

        <div className="admin-filter-chips">
          <div className="admin-filter-chip">
            <div className="admin-filter-label">
              <IonIcon icon={filterOutline} />
              <span>Rôle:</span>
            </div>
            <IonSelect
              interface="popover"
              className="admin-select-filter"
              value={roleFilter}
              onIonChange={(e) => setRoleFilter(e.detail.value)}
            >
              <IonSelectOption value="all">Tous</IonSelectOption>
              <IonSelectOption value="client">Client</IonSelectOption>
              <IonSelectOption value="employé">Employé</IonSelectOption>
              <IonSelectOption value="admin">Admin</IonSelectOption>
            </IonSelect>
          </div>

          <div className="admin-filter-chip">
            <div className="admin-filter-label">
              <IonIcon icon={filterOutline} />
              <span>Statut:</span>
            </div>
            <IonSelect
              interface="popover"
              className="admin-select-filter"
              value={statusFilter}
              onIonChange={(e) => setStatusFilter(e.detail.value)}
            >
              <IonSelectOption value="all">Tous</IonSelectOption>
              <IonSelectOption value="actif">Actif</IonSelectOption>
              <IonSelectOption value="inactif">Inactif</IonSelectOption>
            </IonSelect>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`admin-role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        className="admin-icon-button edit"
                        onClick={() => setActiveTab("create")}
                        title="Modifier"
                      >
                        <IonIcon icon={createOutline} />
                      </button>
                      <button className="admin-icon-button delete" title="Supprimer">
                        <IonIcon icon={trashOutline} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="admin-no-results">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderUserForm = () => (
    <div className="admin-form-container">
      <form className="admin-user-form">
        <div className="admin-form-group">
          <label className="admin-form-label">Nom</label>
          <div className="admin-input-wrapper">
            <IonInput type="text" required className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Email</label>
          <div className="admin-input-wrapper">
            <IonInput type="email" required className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Rôle</label>
          <div className="admin-select-wrapper">
            <IonSelect interface="popover" className="admin-select">
              <IonSelectOption value="client">Client</IonSelectOption>
              <IonSelectOption value="employee">Employé</IonSelectOption>
              <IonSelectOption value="admin">Admin</IonSelectOption>
            </IonSelect>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Statut</label>
          <div className="admin-select-wrapper">
            <IonSelect interface="popover" className="admin-select">
              <IonSelectOption value="actif">Actif</IonSelectOption>
              <IonSelectOption value="inactif">Inactif</IonSelectOption>
            </IonSelect>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-button secondary" onClick={() => setActiveTab("list")}>
            Annuler
          </button>
          <button type="submit" className="admin-button primary">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )

  const renderPasswordReset = () => (
    <div className="admin-form-container">
      <form className="admin-reset-form">
        <div className="admin-form-group">
          <label className="admin-form-label">Email de l'utilisateur</label>
          <div className="admin-input-wrapper">
            <IonInput type="email" required className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-button secondary" onClick={() => setActiveTab("list")}>
            Annuler
          </button>
          <button type="submit" className="admin-button primary">
            Envoyer le lien de réinitialisation
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Utilisateurs" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <div className="admin-dashboard-header">
            <div className="admin-header-title">
              <h1>Gestion des Utilisateurs</h1>
              <p>Gérez les comptes utilisateurs et leurs permissions</p>
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
                className={`admin-tab ${activeTab === "list" ? "active" : ""}`}
                onClick={() => setActiveTab("list")}
              >
                <IonIcon icon={peopleOutline} />
                <span>Liste des utilisateurs</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "create" ? "active" : ""}`}
                onClick={() => setActiveTab("create")}
              >
                <IonIcon icon={personAddOutline} />
                <span>Créer/Éditer un utilisateur</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "reset" ? "active" : ""}`}
                onClick={() => setActiveTab("reset")}
              >
                <IonIcon icon={keyOutline} />
                <span>Réinitialiser le mot de passe</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "list" && renderUserList()}
              {activeTab === "create" && renderUserForm()}
              {activeTab === "reset" && renderPasswordReset()}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  )
}

export default UserManagement

