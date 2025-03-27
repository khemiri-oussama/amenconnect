"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { IonToolbar, IonRippleEffect, IonIcon } from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  homeOutline,
  walletOutline,
  chatbubbleOutline,
  cardOutline,
  swapHorizontalOutline,
  personOutline,
  logOutOutline,
  chevronDownOutline,
} from "ionicons/icons"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import "./NavbarKiosk.css"

interface NavbarKioskProps {
  currentPage: string
}

const NavbarKiosk: React.FC<NavbarKioskProps> = ({ currentPage }) => {
  const history = useHistory()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Access auth context directly
  const { setProfile, setIsAuthenticated, setPendingUser } = useAuth()

  const navItems = [
    { id: "accueil", label: "Accueil", icon: homeOutline, path: "/accueil" },
    { id: "compte", label: "Comptes", icon: walletOutline, path: "/compte" },
    { id: "chat", label: "Chat", icon: chatbubbleOutline, path: "/ChatBot" },
    { id: "carte", label: "Cartes", icon: cardOutline, path: "/Carte" },
    { id: "virements", label: "Virements", icon: swapHorizontalOutline, path: "/virement" },
  ]

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setShowDropdown(!showDropdown)
  }

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }, [])

  // Add event listener for clicks outside dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [handleClickOutside])

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true })
      if (setIsAuthenticated) setIsAuthenticated(false)
      if (setProfile) setProfile(null)
      if (setPendingUser) setPendingUser(null)
      setTimeout(() => {
        window.location.href = "/login"
      }, 100)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <IonToolbar className="navbar-kiosk-toolbar">
        <div className="navbar-kiosk-container">

          <div className="navbar-kiosk-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`navbar-kiosk-link ion-activatable ${currentPage === item.id ? "active" : ""}`}
                onClick={() => history.push(item.path)}
              >
                <div className="navbar-kiosk-link-content">
                  <IonIcon icon={item.icon} className="navbar-kiosk-icon" />
                  <span className="navbar-kiosk-label">{item.label}</span>
                </div>
                <IonRippleEffect />
              </button>
            ))}

            <div className="navbar-kiosk-dropdown-container">
              <button
                ref={buttonRef}
                className="navbar-kiosk-link navbar-kiosk-profile-button ion-activatable"
                onClick={toggleDropdown}
              >
                <div className="navbar-kiosk-link-content">
                  <IonIcon icon={personOutline} className="navbar-kiosk-icon" />
                  <span className="navbar-kiosk-label">Profil</span>
                  <IonIcon
                    icon={chevronDownOutline}
                    className={`navbar-kiosk-dropdown-icon ${showDropdown ? "open" : ""}`}
                  />
                </div>
                <IonRippleEffect />
              </button>
            </div>
          </div>
        </div>
      </IonToolbar>

      {/* Render dropdown outside the IonToolbar */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="navbar-kiosk-dropdown-menu"
          style={{
            position: "fixed",
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 5 : 80,
            right: 20,
            zIndex: 99999,
          }}
        >
          <button className="navbar-kiosk-dropdown-item ion-activatable" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
            <span>Déconnexion</span>
            <IonRippleEffect />
          </button>
        </div>
      )}
    </>
  )
}

export default NavbarKiosk

