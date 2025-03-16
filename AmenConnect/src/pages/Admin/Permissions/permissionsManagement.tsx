"use client"

import React, { useState, useEffect, type ReactNode } from "react"
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
  filterOutline,
  searchOutline,
  timeOutline,
  personOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  warningOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons"
import "./permissionsManagement.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"

interface AuditLogEntry {
  ip: string
  timestamp: string | number | Date
  level: ReactNode
  adminId: any
  email: any
  message: ReactNode
  event: string
  user: string
  action: string
  date: string
  details: string
  status?: "success" | "warning" | "error" | "info"
}

const PermissionsManagement: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"matrix" | "rules" | "audit">("matrix")
  const [roleFilter, setRoleFilter] = useState("all")
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const roles = ["Admin", "Manager", "User"]
  const permissions = ["View", "Edit", "Create", "Delete", "Approve"]

  // Fetch audit logs when the audit tab is active
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (activeTab === "audit") {
        setLogsLoading(true)
        try {
          const res = await fetch("/api/audit-logs", { credentials: "include" })
          if (!res.ok) {
            console.error("Error fetching audit logs")
            setLogsLoading(false)
            return
          }
          const data = await res.json()
          // Enhance logs with status based on level
          const enhancedLogs = data.logs.map((log: AuditLogEntry) => {
            let status: "success" | "warning" | "error" | "info" = "info"
            if (typeof log.level === "string") {
              if (log.level.toLowerCase().includes("error")) status = "error"
              else if (log.level.toLowerCase().includes("warn")) status = "warning"
              else if (log.level.toLowerCase().includes("success")) status = "success"
            }
            return { ...log, status }
          })
          setAuditLogs(enhancedLogs)
        } catch (error) {
          console.error("Failed to fetch audit logs", error)
        }
        setLogsLoading(false)
      }
    }
    fetchAuditLogs()
  }, [activeTab])

  // Filter logs based on search query, date filter, and action filter
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      (log.message && String(log.message).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.email && String(log.email).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.adminId && String(log.adminId).toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const logDate = new Date(log.timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)

        if (dateFilter === "today") {
          return logDate.toDateString() === today.toDateString()
        } else if (dateFilter === "yesterday") {
          return logDate.toDateString() === yesterday.toDateString()
        } else if (dateFilter === "week") {
          return logDate >= lastWeek
        }
        return true
      })()

    const matchesAction =
      actionFilter === "all" || (log.level && String(log.level).toLowerCase().includes(actionFilter.toLowerCase()))

    return matchesSearch && matchesDate && matchesAction
  })

  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "success":
        return checkmarkCircleOutline
      case "warning":
        return warningOutline
      case "error":
        return alertCircleOutline
      default:
        return informationCircleOutline
    }
  }

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
      <div className="audit-log-filters">
        <div className="audit-search-container">
          <IonIcon icon={searchOutline} className="audit-search-icon" />
          <input
            type="text"
            placeholder="Search logs..."
            className="audit-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="audit-filter-group">
          <div className="audit-filter">
            <IonIcon icon={timeOutline} className="audit-filter-icon" />
            <select className="audit-filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>

          <div className="audit-filter">
            <IonIcon icon={filterOutline} className="audit-filter-icon" />
            <select
              className="audit-filter-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="error">Errors</option>
              <option value="warn">Warnings</option>
              <option value="info">Information</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
      </div>

      {logsLoading ? (
        <div className="audit-loading">
          <div className="audit-loading-spinner"></div>
          <span>Loading audit logs...</span>
        </div>
      ) : (
        <div className="admin-table-container audit-table-container">
          <table className="admin-table audit-table">
            <thead>
              <tr>
                <th className="audit-status-col"></th>
                <th>Event</th>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
                <th className="audit-details-col">Details</th>
                <th className="audit-expand-col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <React.Fragment key={index}>
                    <tr className={`audit-row ${expandedRows.includes(index) ? "expanded" : ""}`}>
                      <td className="audit-status-col">
                        <div className={`audit-status-indicator ${log.status || "info"}`}>
                          <IonIcon icon={getStatusIcon(log.status)} className="audit-status-icon" />
                        </div>
                      </td>
                      <td className="audit-event-col">{log.message}</td>
                      <td className="audit-user-col">
                        <div className="audit-user">
                          <div className="audit-user-avatar">
                            <IonIcon icon={personOutline} />
                          </div>
                          <span>{log.email || log.adminId || "N/A"}</span>
                        </div>
                      </td>
                      <td className="audit-action-col">
                        <span
                          className={`audit-action-badge ${typeof log.level === "string" ? log.level.toLowerCase() : "info"}`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="audit-date-col">
                        <div className="audit-date">
                          <span className="audit-date-full">{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="audit-date-relative">
                            {(() => {
                              const now = new Date()
                              const logDate = new Date(log.timestamp)
                              const diffMs = now.getTime() - logDate.getTime()
                              const diffMins = Math.floor(diffMs / 60000)

                              if (diffMins < 1) return "Just now"
                              if (diffMins < 60) return `${diffMins}m ago`

                              const diffHours = Math.floor(diffMins / 60)
                              if (diffHours < 24) return `${diffHours}h ago`

                              const diffDays = Math.floor(diffHours / 24)
                              return `${diffDays}d ago`
                            })()}
                          </span>
                        </div>
                      </td>
                      <td className="audit-details-col">
                        <span className="audit-ip">{log.ip || "Unknown IP"}</span>
                      </td>
                      <td className="audit-expand-col">
                        <button
                          className="audit-expand-button"
                          onClick={() => toggleRowExpansion(index)}
                          aria-label={expandedRows.includes(index) ? "Collapse details" : "Expand details"}
                        >
                          <IonIcon icon={expandedRows.includes(index) ? chevronUpOutline : chevronDownOutline} />
                        </button>
                      </td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr className="audit-expanded-row">
                        <td colSpan={7}>
                          <div className="audit-expanded-content">
                            <div className="audit-expanded-section">
                              <h4>Event Details</h4>
                              <p>{log.message}</p>
                            </div>
                            <div className="audit-expanded-section">
                              <h4>Technical Information</h4>
                              <div className="audit-expanded-details">
                                <div className="audit-detail-item">
                                  <span className="audit-detail-label">IP Address:</span>
                                  <span className="audit-detail-value">{log.ip || "N/A"}</span>
                                </div>
                                <div className="audit-detail-item">
                                  <span className="audit-detail-label">User ID:</span>
                                  <span className="audit-detail-value">{log.adminId || "N/A"}</span>
                                </div>
                                <div className="audit-detail-item">
                                  <span className="audit-detail-label">Email:</span>
                                  <span className="audit-detail-value">{log.email || "N/A"}</span>
                                </div>
                                <div className="audit-detail-item">
                                  <span className="audit-detail-label">Timestamp:</span>
                                  <span className="audit-detail-value">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="audit-empty">
                    <div className="audit-empty-state">
                      <IonIcon icon={documentTextOutline} className="audit-empty-icon" />
                      <p>No audit logs found matching your filters.</p>
                      {searchQuery || dateFilter !== "all" || actionFilter !== "all" ? (
                        <button
                          className="audit-reset-button"
                          onClick={() => {
                            setSearchQuery("")
                            setDateFilter("all")
                            setActionFilter("all")
                          }}
                        >
                          Reset Filters
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="audit-log-summary">
        <span>
          Showing {filteredLogs.length} of {auditLogs.length} log entries
        </span>
        <button className="audit-export-button">
          <IonIcon icon={documentTextOutline} />
          Export Logs
        </button>
      </div>
    </div>
  )

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Permissions" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <AdminPageHeader
            title="Permissions Management"
            subtitle="Manage role-based access control and security policies"
          />
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

