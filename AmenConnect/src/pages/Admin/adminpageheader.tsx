"use client"

import type React from "react"
import { IonIcon } from "@ionic/react"
import { notificationsOutline } from "ionicons/icons"

interface AdminPageHeaderProps {
  title: string
  subtitle: string
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="admin-dashboard-header">
      <div className="admin-header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
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
  )
}

export default AdminPageHeader

