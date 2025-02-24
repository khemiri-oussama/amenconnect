"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { IonButton, IonIcon } from "@ionic/react"
import { notificationsOutline, closeOutline } from "ionicons/icons"
import "./NotificationDesktop.css"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

const NotificationDesktop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nouveau paiement reçu",
      message: "Vous avez reçu un virement de 500 TND",
      time: "Il y a 5 minutes",
      read: false,
    },
    {
      id: 2,
      title: "Rappel de facture",
      message: "Votre facture d'électricité est due dans 3 jours",
      time: "Il y a 2 heures",
      read: false,
    },
    {
      id: 3,
      title: "Mise à jour de sécurité",
      message: "Veuillez mettre à jour votre mot de passe",
      time: "Hier",
      read: true,
    },
  ])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="NotificationD-menu-container" ref={menuRef}>
      <IonButton fill="clear" className="notification-button" onClick={toggleMenu}>
        <IonIcon slot="icon-only" icon={notificationsOutline} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </IonButton>
      {isOpen && (
        <div className="NotificationD-dropdown">
          <div className="NotificationD-dropdown-arrow"></div>
          <div className="NotificationD-header">
            <h3>Notifications</h3>
          </div>
          <div className="NotificationD-menu-list-container">
            <ul className="NotificationD-menu-list">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`notification-item ${notif.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDesktop

