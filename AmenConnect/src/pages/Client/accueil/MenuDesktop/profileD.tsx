"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { IonIcon, IonButton } from "@ionic/react"
import { cameraOutline, pencilOutline, closeOutline } from "ionicons/icons"
import "./profileD.css"

interface UserInfo {
  prénom: string
  nom: string
  email: string
  phoneNumber: string
  avatarUrl: string
}

interface ProfileDProps {
  onClose: () => void
}

const ProfileD: React.FC<ProfileDProps> = ({ onClose }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    prénom: "",
    nom: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "/placeholder.svg?height=150&width=150",
  })

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        setUserInfo({
          prénom: parsedData.prénom || "Prénom",
          nom: parsedData.nom || "Nom",
          email: parsedData.email || "email@example.com",
          phoneNumber: parsedData.phoneNumber || "+216 XX XXX XXX",
          avatarUrl: parsedData.avatarUrl || "/placeholder.svg?height=150&width=150",
        })
      } catch (error) {
        console.error("Erreur lors du parsing du sessionStorage:", error)
      }
    }
  }, [])

  const handleAvatarChange = () => {
    // Implement avatar change functionality here
    
  }

  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div className="profile-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <IonIcon icon={closeOutline} />
        </button>
        <div className="profile-header">
          <h1>Profil Utilisateur</h1>
        </div>
        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={userInfo.avatarUrl || "/placeholder.svg"} alt="Avatar" className="avatar-image" />
              <button className="avatar-edit-button" onClick={handleAvatarChange}>
                <IonIcon icon={cameraOutline} />
              </button>
            </div>
          </div>
          <div className="user-info-section">
            <div className="info-item">
              <label>Nom complet</label>
              <p>{`${userInfo.prénom} ${userInfo.nom}`}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{userInfo.email}</p>
            </div>
            <div className="info-item">
              <label>Numéro de téléphone</label>
              <p>{userInfo.phoneNumber}</p>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <IonButton expand="block" className="edit-profile-button">
            <IonIcon slot="start" icon={pencilOutline} />
            Modifier le profil
          </IonButton>
        </div>
      </div>
    </div>
  )
}

export default ProfileD

