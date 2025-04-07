"use client"

import React, { useEffect, useState } from "react";
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
} from "@ionic/react";
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
} from "ionicons/icons";
import "./ProfileModal.css";
import { useAuth } from "../../../../AuthContext";

interface UserInfo {
  prénom: string;
  nom: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
  location: string;
  occupation: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    prénom: "John",
    nom: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+216 XX XXX XXX",
    avatarUrl: "/placeholder.svg?height=150&width=150",
    dateOfBirth: "15 Janvier 1990",
    location: "Paris, France",
    occupation: "Développeur Full Stack",
  });

  useEffect(() => {
    if (profile && profile.user) {
      setUserInfo({
        prénom: profile.user.prenom || "John",
        nom: profile.user.nom || "Doe",
        email: profile.user.email || "john.doe@example.com",
        phoneNumber: profile.user.telephone || "+216 XX XXX XXX",
        avatarUrl: "./avatar.png?height=150&width=150",
        dateOfBirth: profile.user.dateOfBirth || "15 Janvier 1990",
        location: profile.user.adresseEmployeur || "Paris, France",
        occupation: profile.user.employeur || "Développeur Full Stack",
      });
    }
  }, [profile]);





  if (authLoading) {
    return null; // Optionally render a loading indicator here
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
              <img
                src={userInfo.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                className="profileD-avatar-image"
              />
              <IonButton
                fill="clear"
                className="profileD-avatar-edit-button"
              >
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
                
              </IonList>
            </div>
          </div>

        </div>
      </IonContent>
    </IonModal>
  );
};

export default ProfileModal;
