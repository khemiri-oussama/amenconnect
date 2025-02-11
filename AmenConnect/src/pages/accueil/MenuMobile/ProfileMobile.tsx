import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonToggle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from "@ionic/react"
import { personCircleOutline, mailOutline, callOutline, lockClosedOutline, saveOutline } from "ionicons/icons"
import "./ProfileMobile.css"
import NavMobile from "../../../components/NavMobile"

const ProfileMobile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Foulen Ben Foulen",
    email: "foulen@example.com",
    phone: "+216 12 345 678",
    password: "••••••••",
    twoFactor: false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setUserInfo((prevState) => ({ ...prevState, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically send the updated info to your backend
    console.log("Saving user info:", userInfo)
    setIsEditing(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/accueil" />
          </IonButtons>
          <IonTitle>Profil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Annuler" : "Modifier"}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <IonIcon icon={personCircleOutline} />
          </div>
          <h1>{userInfo.name}</h1>
        </div>
        <IonList className="profile-list">
          <IonItem>
            <IonIcon icon={personCircleOutline} slot="start" />
            <IonLabel position="stacked">Nom</IonLabel>
            <IonInput
              value={userInfo.name}
              onIonChange={(e) => handleChange("name", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              value={userInfo.email}
              onIonChange={(e) => handleChange("email", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={callOutline} slot="start" />
            <IonLabel position="stacked">Téléphone</IonLabel>
            <IonInput
              value={userInfo.phone}
              onIonChange={(e) => handleChange("phone", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={lockClosedOutline} slot="start" />
            <IonLabel position="stacked">Mot de passe</IonLabel>
            <IonInput
              value={userInfo.password}
              type="password"
              readonly={true}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Authentification à deux facteurs</IonLabel>
            <IonToggle
              checked={userInfo.twoFactor}
              onIonChange={(e) => handleChange("twoFactor", e.detail.checked)}
              disabled={!isEditing}
            />
          </IonItem>
        </IonList>
        {isEditing && (
          <div className="save-button-container">
            <IonButton expand="block" onClick={handleSave}>
              <IonIcon icon={saveOutline} slot="start" />
              Enregistrer les modifications
            </IonButton>
          </div>
        )}
      </IonContent>
      <NavMobile currentPage="profile" />
    </IonPage>
  )
}

export default ProfileMobile

