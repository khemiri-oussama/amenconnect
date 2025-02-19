"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react"
import {
  cameraOutline,
  closeOutline,
  personOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  locationOutline,
  briefcaseOutline,
  schoolOutline,
  pencilOutline,
} from "ionicons/icons"
import "./ProfileModal.css"

interface UserInfo {
  prénom: string
  nom: string
  email: string
  phoneNumber: string
  avatarUrl: string
  dateOfBirth: string
  location: string
  occupation: string
  education: string
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    prénom: "John",
    nom: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+216 XX XXX XXX",
    avatarUrl: "/placeholder.svg?height=150&width=150",
    dateOfBirth: "15 Janvier 1990",
    location: "Paris, France",
    occupation: "Développeur Full Stack",
    education: "Master en Informatique, Université de Paris",
  })

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (userData) {
      try {
        const parsedData = JSON.parse(userData)
        setUserInfo((prevInfo) => ({ ...prevInfo, ...parsedData }))
      } catch (error) {
        console.error("Erreur lors du parsing du sessionStorage:", error)
      }
    }
  }, [])

  const handleAvatarChange = () => {
    // Implement avatar change functionality here
    console.log("Avatar change functionality to be implemented")
  }

  const handleEditProfile = () => {
    // Implement edit profile functionality here
    console.log("Edit profile functionality to be implemented")
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="profileD-modal">
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Profil Utilisateur</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" color="dark">
        <div className="profileD-content">
          <div className="profileD-avatar-section">
            <div className="profileD-avatar-container">
              <img src={userInfo.avatarUrl || "/placeholder.svg"} alt="Avatar" className="profileD-avatar-image" />
              <IonButton fill="clear" className="profileD-avatar-edit-button" onClick={handleAvatarChange}>
                <IonIcon icon={cameraOutline} />
              </IonButton>
            </div>
            <div className="profileD-user-info">
              <h2 className="profileD-user-name">{`${userInfo.prénom} ${userInfo.nom}`}</h2>
              <p className="profileD-user-occupation">{userInfo.occupation}</p>
            </div>
          </div>

          <div className="profileD-main-content">
            <div className="profileD-info-section">
              <h3 className="profileD-section-title">Informations personnelles</h3>
              <IonList className="profileD-info-list">
                <IonItem>
                  <IonIcon icon={personOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Nom complet</h2>
                    <p>{`${userInfo.prénom} ${userInfo.nom}`}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Email</h2>
                    <p>{userInfo.email}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={callOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Numéro de téléphone</h2>
                    <p>{userInfo.phoneNumber}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={calendarOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Date de naissance</h2>
                    <p>{userInfo.dateOfBirth}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Localisation</h2>
                    <p>{userInfo.location}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={briefcaseOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Profession</h2>
                    <p>{userInfo.occupation}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={schoolOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h2>Formation</h2>
                    <p>{userInfo.education}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </div>
          </div>

          <IonButton expand="block" className="profileD-edit-button" onClick={handleEditProfile}>
            <IonIcon slot="start" icon={pencilOutline} />
            Modifier le profil
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default ProfileModal

