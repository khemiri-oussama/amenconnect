"use client"

import type React from "react"
import { useState } from "react"
import { IonPage, IonIcon, IonInput, IonToggle, IonRange } from "@ionic/react"
import {
  lockClosedOutline,
  timerOutline,
  shieldOutline,
  saveOutline,
  logOutOutline,
  notificationsOutline,
} from "ionicons/icons"
import "./authenticationSecurity.css"
import SidebarAdmin from "../../../components/SidebarAdmin"
import { useAdminAuth } from "../../../AdminAuthContext"
import AdminPageHeader from "../adminpageheader"

const AuthenticationSecurity: React.FC = () => {
  const { authLoading } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<"2fa" | "sessions" | "policies">("2fa")

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const render2FAConfig = () => (
    <div className="admin-form-container">
      <div className="admin-security-list">
        <div className="admin-security-item">
          <div className="admin-security-label">Enable 2FA</div>
          <IonToggle className="admin-toggle" />
        </div>

        <div className="admin-security-item">
          <div className="admin-security-label">SMS Authentication</div>
          <IonToggle className="admin-toggle" />
        </div>

        <div className="admin-security-item">
          <div className="admin-security-label">Email Authentication</div>
          <IonToggle className="admin-toggle" />
        </div>

        <div className="admin-security-item">
          <div className="admin-security-label">Google Authenticator</div>
          <IonToggle className="admin-toggle" />
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-button primary">
          <IonIcon icon={saveOutline} />
          <span>Save 2FA Settings</span>
        </button>
      </div>
    </div>
  )

  const renderSessionManagement = () => (
    <div className="admin-form-container">
      <div className="admin-security-list">
        <div className="admin-security-item range-item">
          <div className="admin-security-label">Inactivity Timeout (minutes)</div>
          <div className="admin-range-wrapper">
            <IonRange min={5} max={60} step={5} snaps={true} pin={true} className="admin-range" />
          </div>
        </div>
      </div>

      <div className="admin-section-title">
        <h3>Active Sessions</h3>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Device</th>
              <th>IP Address</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((_, index) => (
              <tr key={index}>
                <td>Session #{index + 1}</td>
                <td>{index % 2 === 0 ? "Desktop" : "Mobile"}</td>
                <td>192.168.1.{100 + index}</td>
                <td>{new Date().toLocaleString()}</td>
                <td>
                  <div className="admin-action-buttons">
                    <button className="admin-icon-button delete" title="Terminate Session">
                      <IonIcon icon={logOutOutline} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSecurityPolicies = () => (
    <div className="admin-form-container">
      <form className="admin-security-form">
        <div className="admin-form-group">
          <label className="admin-form-label">Minimum Password Length</label>
          <div className="admin-input-wrapper">
            <IonInput type="number" min={8} max={32} value={12} className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-security-list">
          <div className="admin-security-item">
            <div className="admin-security-label">Require Uppercase</div>
            <IonToggle className="admin-toggle" />
          </div>

          <div className="admin-security-item">
            <div className="admin-security-label">Require Numbers</div>
            <IonToggle className="admin-toggle" />
          </div>

          <div className="admin-security-item">
            <div className="admin-security-label">Require Special Characters</div>
            <IonToggle className="admin-toggle" />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Max Failed Attempts</label>
          <div className="admin-input-wrapper">
            <IonInput type="number" min={3} max={10} value={5} className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Lockout Duration (minutes)</label>
          <div className="admin-input-wrapper">
            <IonInput type="number" min={5} max={60} value={30} className="admin-input"></IonInput>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-button primary">
            <IonIcon icon={saveOutline} />
            <span>Save Security Policies</span>
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Sécurité" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          
        <AdminPageHeader title="Authentication & Security" subtitle="Manage authentication methods and security policies" />

          {/* Main Card */}
          <div className="admin-content-card">
            {/* Tabs */}
            <div className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "2fa" ? "active" : ""}`}
                onClick={() => setActiveTab("2fa")}
              >
                <IonIcon icon={lockClosedOutline} />
                <span>2FA Configuration</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "sessions" ? "active" : ""}`}
                onClick={() => setActiveTab("sessions")}
              >
                <IonIcon icon={timerOutline} />
                <span>Session Management</span>
              </button>
              <button
                className={`admin-tab ${activeTab === "policies" ? "active" : ""}`}
                onClick={() => setActiveTab("policies")}
              >
                <IonIcon icon={shieldOutline} />
                <span>Security Policies</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="admin-tab-content">
              {activeTab === "2fa" && render2FAConfig()}
              {activeTab === "sessions" && renderSessionManagement()}
              {activeTab === "policies" && renderSecurityPolicies()}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  )
}

export default AuthenticationSecurity

