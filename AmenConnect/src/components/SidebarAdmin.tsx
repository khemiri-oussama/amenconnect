"use client"

import type React from "react"
import { IonImg, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import {
  homeOutline,
  peopleOutline,
  settingsOutline,
  logOutOutline,
  shieldOutline,
  desktopOutline,
  videocamOutline,
  colorPaletteOutline, // Added for Themes icon
} from "ionicons/icons"
import "./SidebarAdmin.css"

interface SidebarAdminProps {
  currentPage: string
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ currentPage }) => {
  const history = useHistory()

  const navItems = [
    { title: "Dashboard", icon: homeOutline, path: "/admin/dashboard" },
    { title: "Utilisateurs", icon: peopleOutline, path: "/admin/userManagement" },
    { title: "Surveillance", icon: shieldOutline, path: "/admin/SurveillanceMonitoring" },
    { title: "Permissions", icon: settingsOutline, path: "/admin/PermissionsManagement" },
    { title: "Sécurité", icon: shieldOutline, path: "/admin/AuthenticationSecurity" },
    { title: "Totems", icon: desktopOutline, path: "/admin/InteractiveTotemManagement" },
    { title: "Visioconférence", icon: videocamOutline, path: "/admin/VideoConferenceManagement" },
    { title: "Thèmes", icon: colorPaletteOutline, path: "/admin/Themes" }, // Added Themes option
  ]

  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true })
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Optionally, display an error message to the user here
    }
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

