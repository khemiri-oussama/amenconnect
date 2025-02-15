"use client"

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
  IonBadge,
  IonButton,
  IonIcon,
  IonList,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonTextarea,
  IonToolbar, // Added import for IonToolbar
  IonTitle, // Added import for IonTitle
} from "@ionic/react"
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  cloudUploadOutline,
  closeCircleOutline,
} from "ionicons/icons"
import "./InteractiveTotemManagement.css"
import NavbarAdmin from "../../../components/NavbarAdmin"

const InteractiveTotemManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"status" | "maintenance" | "incidents">("status")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null)

  const totems = [
    { id: "TM001", status: "online", version: "1.2.3", temperature: 42 },
    { id: "TM002", status: "offline", version: "1.2.2", temperature: 0 },
    { id: "TM003", status: "online", version: "1.2.3", temperature: 38 },
  ]

  const renderDeviceStatus = () => (
    <div className="itm-device-status">
      <IonGrid>
        <IonRow className="itm-header-row">
          <IonCol>Totem ID</IonCol>
          <IonCol>Status</IonCol>
          <IonCol>Version</IonCol>
          <IonCol>Temperature</IonCol>
          <IonCol>Actions</IonCol>
        </IonRow>
        {totems.map((totem) => (
          <IonRow key={totem.id} className="itm-totem-row">
            <IonCol>{totem.id}</IonCol>
            <IonCol>
              <IonBadge color={totem.status === "online" ? "success" : "danger"}>{totem.status}</IonBadge>
            </IonCol>
            <IonCol>{totem.version}</IonCol>
            <IonCol>
              <IonIcon icon={thermometerOutline} />
              {totem.status === "online" ? `${totem.temperature}°C` : "N/A"}
            </IonCol>
            <IonCol>
              <IonButton fill="clear" size="small" disabled={totem.status === "offline"}>
                <IonIcon slot="icon-only" icon={refreshOutline} />
              </IonButton>
              <IonButton fill="clear" size="small" disabled={totem.status === "offline"}>
                <IonIcon slot="icon-only" icon={powerOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
    </div>
  )

  const renderRemoteMaintenance = () => (
    <div className="itm-remote-maintenance">
      <IonList>
        <IonItem>
          <IonLabel>Select Totem</IonLabel>
          <IonSelect placeholder="Choose a totem">
            {totems.map((totem) => (
              <IonSelectOption key={totem.id} value={totem.id}>
                {totem.id}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Action</IonLabel>
          <IonSelect placeholder="Choose an action">
            <IonSelectOption value="update">Update Software</IonSelectOption>
            <IonSelectOption value="restart">Restart Totem</IonSelectOption>
            <IonSelectOption value="diagnose">Run Diagnostics</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
      <IonButton expand="block" className="itm-action-button">
        <IonIcon slot="start" icon={cloudUploadOutline} />
        Execute Action
      </IonButton>
      <IonCard className="itm-progress-card">
        <IonCardContent>
          <IonLabel>Update Progress</IonLabel>
          <IonProgressBar value={0.5}></IonProgressBar>
        </IonCardContent>
      </IonCard>
    </div>
  )

  const renderIncidentLog = () => (
    <div className="itm-incident-log">
      <IonList>
        {[1, 2, 3].map((_, index) => (
          <IonItem
            key={index}
            className="itm-incident-item"
            button
            onClick={() => {
              setSelectedTotem(`TM00${index + 1}`)
              setIsModalOpen(true)
            }}
          >
            <IonIcon icon={bugOutline} slot="start" />
            <IonLabel>
              <h2>Incident #{1000 + index}</h2>
              <p>
                Totem: TM00{index + 1} | Date: {new Date().toLocaleString()}
              </p>
              <p>Type: {index % 2 === 0 ? "Hardware Failure" : "Software Error"}</p>
            </IonLabel>
            <IonBadge color={index % 2 === 0 ? "warning" : "danger"} slot="end">
              {index % 2 === 0 ? "Open" : "Critical"}
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    </div>
  )

  return (
    <IonPage className="itm-page">
      <IonHeader>
        <NavbarAdmin currentPage="InteractiveTotemManagement" />
      </IonHeader>
      <IonContent className="itm-content ion-padding">
        <IonCard className="itm-card">
          <IonCardHeader className="itm-card-header">
            <IonCardTitle className="itm-card-title">Interactive Totem Management</IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="itm-card-content">
            <div className="itm-tabs">
              <IonButton fill={activeTab === "status" ? "solid" : "clear"} onClick={() => setActiveTab("status")}>
                Device Status
              </IonButton>
              <IonButton
                fill={activeTab === "maintenance" ? "solid" : "clear"}
                onClick={() => setActiveTab("maintenance")}
              >
                Remote Maintenance
              </IonButton>
              <IonButton fill={activeTab === "incidents" ? "solid" : "clear"} onClick={() => setActiveTab("incidents")}>
                Incident Log
              </IonButton>
            </div>
            {activeTab === "status" && renderDeviceStatus()}
            {activeTab === "maintenance" && renderRemoteMaintenance()}
            {activeTab === "incidents" && renderIncidentLog()}
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            {" "}
            {/* Added IonToolbar */}
            <IonTitle>Incident Details - {selectedTotem}</IonTitle> {/* Added IonTitle */}
            <IonButton slot="end" onClick={() => setIsModalOpen(false)}>
              <IonIcon slot="icon-only" icon={closeCircleOutline} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTextarea rows={10} placeholder="Enter incident details here..." />
          <IonButton expand="block" className="itm-save-button">
            Save Incident Report
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}

export default InteractiveTotemManagement

