// MenuDesktop/ProfileMenu.tsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { IonIcon } from "@ionic/react"
import { personOutline, settingsOutline, logOutOutline, chevronDown } from "ionicons/icons"
import "./ProfileMenu.css"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../../../AuthContext"
import ProfileModal from "./ProfileModal"  // Adjust the import path as needed

const ProfileMenu: React.FC = () => {
  const { setIsAuthenticated,setProfile, setPendingUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const history = useHistory()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true })
      setIsAuthenticated(false)
      setProfile(null),
      setPendingUser(null)
      setTimeout(() => {
        window.location.href = "/login";
      }, 100)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="profileD-menu-container" ref={menuRef}>
        <button className="profileD-button" onClick={toggleMenu}>
          Menu
          <IonIcon icon={chevronDown} />
        </button>
        {isOpen && (
          <div className="profileD-dropdown">
            <div className="profileD-dropdown-arrow"></div>
            <ul className="profileD-menu-list">
              <li onClick={openProfileModal} style={{ cursor: "pointer" }}>
                <IonIcon icon={personOutline} />
                Voir le profil
              </li>
              <li>
                <a href="/settings">
                  <IonIcon icon={settingsOutline} />
                  Gérer les paramètres
                </a>
              </li>
              <li className="logout-item" onClick={handleLogout}>
                <IonIcon icon={logOutOutline} />
                Déconnexion
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Render the Profile Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}

export default ProfileMenu
