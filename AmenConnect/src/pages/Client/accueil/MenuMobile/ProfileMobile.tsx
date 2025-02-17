import React, { useState, useEffect } from "react"; // Ensure React is imported
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
} from "@ionic/react";
import { personCircleOutline, mailOutline, callOutline, lockClosedOutline, saveOutline } from "ionicons/icons";
import "./ProfileMobile.css";
import NavMobile from "../../../../components/NavMobile";

const ProfileMobile: React.FC = () => {
  // Move useState and useEffect inside the component
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setPrenom(parsedData.prénom || "Utilisateur");
        setNom(parsedData.nom || "Foulen");
        setEmail(parsedData.email || "example@ex.com");
        setFullname(`${parsedData.prénom || "Utilisateur"} ${parsedData.nom || "Foulen"}`);
      } catch (error) {
        console.error("Erreur lors du parsing du localStorage:", error);
      }
    }
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    console.log("Saving user info:");
    // You can update the state here if needed
  };

  const handleSave = () => {
    // Here you would typically send the updated info to your backend
    console.log("Saving user info:");
    setIsEditing(false);
  };

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
          <h1>{fullname}</h1>
        </div>
        <IonList className="profile-list">
          <IonItem>
            <IonIcon icon={personCircleOutline} slot="start" />
            <IonLabel position="stacked">Nom</IonLabel>
            <IonInput
              value={fullname}
              onIonChange={(e) => handleChange("name", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              value={email}
              onIonChange={(e) => handleChange("email", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={callOutline} slot="start" />
            <IonLabel position="stacked">Téléphone</IonLabel>
            <IonInput
              value={"+216 21636657"}
              onIonChange={(e) => handleChange("phone", e.detail.value!)}
              readonly={!isEditing}
            />
          </IonItem>
          <IonItem>
            <IonIcon icon={lockClosedOutline} slot="start" />
            <IonLabel position="stacked">Mot de passe</IonLabel>
            <IonInput
              value={"••••••••"}
              type="password"
              readonly={true}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Authentification à deux facteurs</IonLabel>
            <IonToggle
              checked={false}
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
  );
};

export default ProfileMobile;