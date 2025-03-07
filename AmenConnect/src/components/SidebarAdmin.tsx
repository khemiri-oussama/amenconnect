"use client"

import type React from "react"
import { IonImg, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  homeOutline,
  peopleOutline,
  swapHorizontalOutline,
  settingsOutline,
  logOutOutline,
  shieldOutline,
  desktopOutline,
} from "ionicons/icons"

interface SidebarAdminProps {
  currentPage: string
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ currentPage }) => {
  const history = useHistory()

  const navItems = [
    { title: "Dashboard", icon: homeOutline, path: "/admin/dashboard" },
    { title: "Utilisateurs", icon: peopleOutline, path: "/admin/userManagement" },
    { title: "Transactions", icon: swapHorizontalOutline, path: "/admin/transactions" },
    { title: "Surveillance", icon: shieldOutline, path: "/admin/SurveillanceMonitoring" },
    { title: "Permissions", icon: settingsOutline, path: "/admin/PermissionsManagement" },
    { title: "Sécurité", icon: shieldOutline, path: "/admin/AuthenticationSecurity" },
    { title: "Totems", icon: desktopOutline, path: "/admin/InteractiveTotemManagement" },
  ]

  const handleLogout = () => {
    // Add your logout logic here
    history.push("/admin/login")
  }

  return (
    <div className="admin-dashboard-sidebar">
      <div className="admin-logo-container">
        <IonImg src="../amen_logo.png" alt="Logo" className="admin-logo" />
      </div>

      <div className="admin-sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.title}
            className={`admin-nav-item ${currentPage === item.title ? "active" : ""}`}
            onClick={() => history.push(item.path)}
          >
            <IonIcon icon={item.icon} className="admin-nav-icon" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-nav-item logout" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} className="admin-nav-icon" />
          <span>Déconnexion</span>
        </div>
      </div>
    </div>
  )
}

export default SidebarAdmin

