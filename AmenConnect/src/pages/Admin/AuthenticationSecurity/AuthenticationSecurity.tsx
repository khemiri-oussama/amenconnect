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
  IonItem,
  IonLabel,
  IonToggle,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonInput,
  IonRange,
} from "@ionic/react"
import { lockClosedOutline, timerOutline, shieldOutline, saveOutline, logOutOutline } from "ionicons/icons"
import "./AuthenticationSecurity.css"
import NavbarAdmin from "../../../components/NavbarAdmin"

const AuthenticationSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"2fa" | "sessions" | "policies">("2fa")

  const render2FAConfig = () => (
    <div className="as-2fa-config">
      <IonList>
        <IonItem>
          <IonLabel>Enable 2FA</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>SMS Authentication</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>Email Authentication</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>Google Authenticator</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
      </IonList>
      <IonButton expand="block" className="as-save-button">
        <IonIcon slot="start" icon={saveOutline} />
        Save 2FA Settings
      </IonButton>
    </div>
  )

  const renderSessionManagement = () => (
    <div className="as-session-management">
      <IonItem>
        <IonLabel>Inactivity Timeout (minutes)</IonLabel>
        <IonRange min={5} max={60} step={5} snaps={true} pin={true} />
      </IonItem>
      <IonList>
        <IonListHeader>
          <IonLabel>Active Sessions</IonLabel>
        </IonListHeader>
        {[1, 2, 3].map((_, index) => (
          <IonItem key={index} className="as-session-item">
            <IonLabel>
              <h2>Session #{index + 1}</h2>
              <p>Device: {index % 2 === 0 ? "Desktop" : "Mobile"}</p>
              <p>IP: 192.168.1.{100 + index}</p>
              <p>Last Active: {new Date().toLocaleString()}</p>
            </IonLabel>
            <IonButton fill="clear" color="danger">
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonItem>
        ))}
      </IonList>
    </div>
  )

  const renderSecurityPolicies = () => (
    <div className="as-security-policies">
      <IonList>
        <IonItem>
          <IonLabel>Minimum Password Length</IonLabel>
          <IonInput type="number" min={8} max={32} value={12} />
        </IonItem>
        <IonItem>
          <IonLabel>Require Uppercase</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>Require Numbers</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>Require Special Characters</IonLabel>
          <IonToggle slot="end" />
        </IonItem>
        <IonItem>
          <IonLabel>Max Failed Attempts</IonLabel>
          <IonInput type="number" min={3} max={10} value={5} />
        </IonItem>
        <IonItem>
          <IonLabel>Lockout Duration (minutes)</IonLabel>
          <IonInput type="number" min={5} max={60} value={30} />
        </IonItem>
      </IonList>
      <IonButton expand="block" className="as-save-button">
        <IonIcon slot="start" icon={saveOutline} />
        Save Security Policies
      </IonButton>
    </div>
  )

  return (
    <IonPage className="as-page">
      <IonHeader>
        <NavbarAdmin currentPage="AuthenticationSecurity" />
      </IonHeader>
      <IonContent className="as-content ion-padding">
        <IonCard className="as-card">
          <IonCardHeader className="as-card-header">
            <IonCardTitle className="as-card-title">Authentication and Security</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="as-card-content">
            <div className="as-tabs">
              <IonButton fill={activeTab === "2fa" ? "solid" : "clear"} onClick={() => setActiveTab("2fa")}>
                <IonIcon slot="start" icon={lockClosedOutline} />
                2FA Config
              </IonButton>
              <IonButton fill={activeTab === "sessions" ? "solid" : "clear"} onClick={() => setActiveTab("sessions")}>
                <IonIcon slot="start" icon={timerOutline} />
                Sessions
              </IonButton>
              <IonButton fill={activeTab === "policies" ? "solid" : "clear"} onClick={() => setActiveTab("policies")}>
                <IonIcon slot="start" icon={shieldOutline} />
                Policies
              </IonButton>
            </div>
            {activeTab === "2fa" && render2FAConfig()}
            {activeTab === "sessions" && renderSessionManagement()}
            {activeTab === "policies" && renderSecurityPolicies()}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default AuthenticationSecurity

