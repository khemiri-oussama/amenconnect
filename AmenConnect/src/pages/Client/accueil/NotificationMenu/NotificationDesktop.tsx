"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { IonButton, IonIcon } from "@ionic/react"
import { notificationsOutline } from "ionicons/icons"
import { io, Socket } from "socket.io-client"
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
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Socket instance ref so that we don't reconnect on every render
  const socketRef = useRef<Socket | null>(null)

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

  // Connect to Socket.IO server and listen for notifications
  useEffect(() => {
    // Replace with your actual server URL
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
    })
  
    // Listen for the "virementReceived" event
    socketRef.current.on("virementReceived", (data: Notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, data])
    })
  
    return () => {
      socketRef.current?.disconnect()
    }
  }, [])
  

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
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
            {notifications.length === 0 ? (
              <div className="no-notifications">Il n'y a aucune notification</div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDesktop
