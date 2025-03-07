"use client"

import type React from "react"
import { useState } from "react"
import {
  IonPage,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonDatetime,
  IonToggle,
} from "@ionic/react"
import {
  gridOutline,
  documentTextOutline,
  settingsOutline,
  saveOutline,
  addOutline,
  notificationsOutline,
  filterOutline,
} from "ionicons/icons"
import "./permissionsManagement.css"
import SidebarAdmin from "../../../components/sidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"

const PermissionsManagement: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"matrix" | "rules" | "audit">("matrix")
  const [roleFilter, setRoleFilter] = useState("all")

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const roles = ["Admin", "Manager", "User"]
  const permissions = ["View", "Edit", "Create", "Delete", "Approve"]

  const renderRoleMatrix = () => (
    <div className="admin-permissions-matrix">
      <div className="admin-filters">
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
              {roles.map((role) => (
                <IonSelectOption key={role} value={role.toLowerCase()}>
                  {role}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table permissions-table">
          <thead>
            <tr>
              <th>Roles</th>
              {permissions.map((permission) => (
                <th key={permission}>{permission}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role}>
                <td>
                  <span className={`admin-role-badge ${role.toLowerCase()}`}>{role}</span>
                </td>
                {permissions.map((permission) => (
                  <td key={`${role}-${permission}`} className="checkbox-cell">
                    <IonCheckbox className="permission-checkbox" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-button primary">
          <IonIcon icon={saveOutline} />
          <span>Save Permissions</span>
        </button>
      </div>
    </div>
  )

  const renderAccessRules = () => (
    <div className="admin-form-container">
      <form className="admin-rules-form">
        <div className="admin-form-group">
          <label className="admin-form-label">Role</label>
          <div className="admin-select-wrapper">
            <IonSelect interface="popover" className="admin-select">
              {roles.map((role) => (
                <IonSelectOption key={role} value={role.toLowerCase()}>
                  {role}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Time Restriction</label>
          <div className="admin-input-wrapper">
            <div className="datetime-label">Select time range</div>
            <IonDatetime presentation="time" className="admin-datetime" />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Geo Restriction</label>
          <div className="admin-input-wrapper">
            <IonInput placeholder="Enter allowed locations" className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-group toggle-group">
          <label className="admin-form-label">Enable IP Restriction</label>
          <IonToggle className="admin-toggle" />
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-button secondary">
            Cancel
          </button>
          <button type="submit" className="admin-button primary">
            <IonIcon icon={addOutline} />
            <span>Add Rule</span>
          </button>
        </div>
      </form>
    </div>
  )

  const renderAuditLog = () => (
    <div className="admin-audit-log">
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="audit-event">
                    <IonIcon icon={documentTextOutline} className="audit-icon" />
                    <span>Permission Change #{index + 1}</span>
                  </div>
                </td>
                <td>Admin User</td>
                <td>
                  <span className="admin-status-badge actif">Modified</span>
                </td>
                <td>{new Date().toLocaleString()}</td>
                <td>Changed View Permission for Manager role</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Permissions" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <div className="admin-dashboard-header">
            <div className="admin-header-title">
              <h1>Permissions Management</h1>
              <p>Manage role-based access control and security policies</p>
            </div>
            <div className="admin-header-actions">
              <div className="admin-notification-badge">
                <IonIcon icon={notificationsOutline} className="admin-header-icon" />
                <span className="admin-badge">2</span>
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
                className={`admin-tab ${activeTab === "matrix" ? "active" : ""}`}
                onClick={() => setActiveTab("matrix")}
              >
                <IonIcon icon={gridOutline} />
                <span>Role Matrix</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "rules" ? "active" : ""}`}
                onClick={() => setActiveTab("rules")}
              >
                <IonIcon icon={settingsOutline} />
                <span>Access Rules</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "audit" ? "active" : ""}`}
                onClick={() => setActiveTab("audit")}
              >
                <IonIcon icon={documentTextOutline} />
                <span>Audit Log</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "matrix" && renderRoleMatrix()}
              {activeTab === "rules" && renderAccessRules()}
              {activeTab === "audit" && renderAuditLog()}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  )
}

export default PermissionsManagement

