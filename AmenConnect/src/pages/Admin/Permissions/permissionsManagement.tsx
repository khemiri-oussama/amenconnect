import type React from "react"
import { useState } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonList,
  IonDatetime,
  IonToggle,
} from "@ionic/react"
import { saveOutline, addOutline, documentTextOutline } from "ionicons/icons"
import "./permissionsManagement.css"
import NavbarAdmin from "../../../components/NavbarAdmin"

const PermissionsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"matrix" | "rules" | "audit">("matrix")

  const roles = ["Admin", "Manager", "User"]
  const permissions = ["View", "Edit", "Approve"]

  const renderRoleMatrix = () => (
    <div className="pm-role-matrix">
      <IonGrid>
        <IonRow>
          <IonCol>Roles</IonCol>
          {permissions.map((permission) => (
            <IonCol key={permission}>{permission}</IonCol>
          ))}
        </IonRow>
        {roles.map((role) => (
          <IonRow key={role}>
            <IonCol>{role}</IonCol>
            {permissions.map((permission) => (
              <IonCol key={`${role}-${permission}`}>
                <IonCheckbox />
              </IonCol>
            ))}
          </IonRow>
        ))}
      </IonGrid>
      <IonButton expand="block" className="pm-save-button">
        <IonIcon slot="start" icon={saveOutline} />
        Save Permissions
      </IonButton>
    </div>
  )

  const renderAccessRules = () => (
    <div className="pm-access-rules">
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Role</IonLabel>
          <IonSelect placeholder="Select role">
            {roles.map((role) => (
              <IonSelectOption key={role} value={role}>
                {role}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Time Restriction</IonLabel>
          <IonDatetime display-format="HH:mm" picker-format="HH:mm" placeholder="Select time range" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Geo Restriction</IonLabel>
          <IonInput placeholder="Enter allowed locations" />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Enable IP Restriction</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
      </IonList>
      <IonButton expand="block" className="pm-save-button">
        <IonIcon slot="start" icon={addOutline} />
        Add Rule
      </IonButton>
    </div>
  )

  const renderAuditLog = () => (
    <div className="pm-audit-log">
      <IonList>
        {[1, 2, 3].map((_, index) => (
          <IonItem key={index} className="pm-audit-item">
            <IonIcon icon={documentTextOutline} slot="start" />
            <IonLabel>
              <h2>Permission Change #{index + 1}</h2>
              <p>Role: Admin | Action: Modified View Permission</p>
              <p>Date: {new Date().toLocaleString()}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  )

  return (
    <IonPage className="pm-page">
      <IonHeader>
        <NavbarAdmin currentPage="PermissionsManagement" />
      </IonHeader>
      <IonContent className="pm-content ion-padding">
        <IonCard className="pm-card">
          <IonCardHeader className="pm-card-header">
            <IonCardTitle className="pm-card-title">Permissions Management</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="pm-card-content">
            <div className="pm-tabs">
              <IonButton fill={activeTab === "matrix" ? "solid" : "clear"} onClick={() => setActiveTab("matrix")}>
                Role Matrix
              </IonButton>
              <IonButton fill={activeTab === "rules" ? "solid" : "clear"} onClick={() => setActiveTab("rules")}>
                Access Rules
              </IonButton>
              <IonButton fill={activeTab === "audit" ? "solid" : "clear"} onClick={() => setActiveTab("audit")}>
                Audit Log
              </IonButton>
            </div>
            {activeTab === "matrix" && renderRoleMatrix()}
            {activeTab === "rules" && renderAccessRules()}
            {activeTab === "audit" && renderAuditLog()}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default PermissionsManagement

