import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonChip,
  IonBadge,
} from "@ionic/react"
import { peopleOutline, personAddOutline, keyOutline, createOutline, trashOutline } from "ionicons/icons"
import "./UserManagement.css"
import NavbarAdmin from "../../../components/NavbarAdmin"

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "reset">("list")

  const renderUserList = () => (
    <div className="um-user-list">
      <div className="um-filters">
        <IonSearchbar className="um-searchbar" placeholder="Rechercher un utilisateur"></IonSearchbar>
        <IonChip className="um-filter-chip">
          <IonLabel>Rôle</IonLabel>
          <IonSelect interface="popover">
            <IonSelectOption value="all">Tous</IonSelectOption>
            <IonSelectOption value="client">Client</IonSelectOption>
            <IonSelectOption value="employee">Employé</IonSelectOption>
            <IonSelectOption value="admin">Admin</IonSelectOption>
          </IonSelect>
        </IonChip>
        <IonChip className="um-filter-chip">
          <IonLabel>Statut</IonLabel>
          <IonSelect interface="popover">
            <IonSelectOption value="all">Tous</IonSelectOption>
            <IonSelectOption value="active">Actif</IonSelectOption>
            <IonSelectOption value="inactive">Inactif</IonSelectOption>
          </IonSelect>
        </IonChip>
      </div>
      <IonList className="um-user-items">
        {["John Doe", "Jane Smith", "Bob Johnson"].map((user, index) => (
          <IonItem key={index} className="um-user-item">
            <IonLabel>
              <h2>{user}</h2>
              <p>john@example.com</p>
            </IonLabel>
            <IonBadge slot="end" color="primary">
              Client
            </IonBadge>
            <IonBadge slot="end" color="success">
              Actif
            </IonBadge>
            <IonButton fill="clear" slot="end">
              <IonIcon icon={createOutline} />
            </IonButton>
            <IonButton fill="clear" slot="end" color="danger">
              <IonIcon icon={trashOutline} />
            </IonButton>
          </IonItem>
        ))}
      </IonList>
    </div>
  )

  const renderUserForm = () => (
    <form className="um-user-form">
      <IonItem className="um-form-item">
        <IonLabel position="floating">Nom</IonLabel>
        <IonInput type="text" required></IonInput>
      </IonItem>
      <IonItem className="um-form-item">
        <IonLabel position="floating">Email</IonLabel>
        <IonInput type="email" required></IonInput>
      </IonItem>
      <IonItem className="um-form-item">
        <IonLabel position="floating">Rôle</IonLabel>
        <IonSelect interface="popover">
          <IonSelectOption value="client">Client</IonSelectOption>
          <IonSelectOption value="employee">Employé</IonSelectOption>
          <IonSelectOption value="admin">Admin</IonSelectOption>
        </IonSelect>
      </IonItem>
      <IonButton expand="block" className="um-submit-btn">
        Enregistrer
      </IonButton>
    </form>
  )

  const renderPasswordReset = () => (
    <form className="um-reset-form">
      <IonItem className="um-form-item">
        <IonLabel position="floating">Email de l'utilisateur</IonLabel>
        <IonInput type="email" required></IonInput>
      </IonItem>
      <IonButton expand="block" className="um-submit-btn">
        Envoyer le lien de réinitialisation
      </IonButton>
    </form>
  )

  return (
    <IonPage className="um-page">
      <IonHeader>
        <NavbarAdmin currentPage="UserManagement" />
      </IonHeader>
      <IonContent className="um-content ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard className="um-card">
                <IonCardHeader className="um-card-header">
                  <IonCardTitle className="um-card-title">Gestion des Utilisateurs</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="um-card-content">
                  <div className="um-tabs">
                    <IonButton fill={activeTab === "list" ? "solid" : "clear"} onClick={() => setActiveTab("list")}>
                      <IonIcon icon={peopleOutline} slot="start" />
                      Liste des utilisateurs
                    </IonButton>
                    <IonButton fill={activeTab === "create" ? "solid" : "clear"} onClick={() => setActiveTab("create")}>
                      <IonIcon icon={personAddOutline} slot="start" />
                      Créer/Éditer un utilisateur
                    </IonButton>
                    <IonButton fill={activeTab === "reset" ? "solid" : "clear"} onClick={() => setActiveTab("reset")}>
                      <IonIcon icon={keyOutline} slot="start" />
                      Réinitialiser le mot de passe
                    </IonButton>
                  </div>
                  {activeTab === "list" && renderUserList()}
                  {activeTab === "create" && renderUserForm()}
                  {activeTab === "reset" && renderPasswordReset()}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default UserManagement

