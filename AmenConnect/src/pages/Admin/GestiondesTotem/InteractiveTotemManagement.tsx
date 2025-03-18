"use client";

import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonProgressBar,
  IonModal,
  IonTextarea,
  IonAlert,
  IonInput,
} from "@ionic/react";
import {
  refreshOutline,
  powerOutline,
  bugOutline,
  thermometerOutline,
  cloudUploadOutline,
  closeCircleOutline,
  saveOutline,
} from "ionicons/icons";
import "./InteractiveTotemManagement.css";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { useAdminAuth } from "../../../AdminAuthContext";
import AdminPageHeader from "../adminpageheader";
import axios from "axios";

interface Totem {
  id: string;
  status: "online" | "offline";
  version: string;
  temperature: number;
}

interface TotemFormData {
  toteId: string;
  status: "online" | "offline";
  version: string;
  temperature: number;
  location: string;
  agencyName: string;
  enabled: boolean;
  deviceId: string;
}

const InteractiveTotemManagement: React.FC = () => {
  const { authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"status" | "maintenance" | "incidents" | "register">("status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTotem, setSelectedTotem] = useState<string | null>(null);
  
  // Initialize kiosks from the API (empty array initially)
  const [totems, setTotems] = useState<Totem[]>([]);
  
  // Remote maintenance state
  const [selectedMaintenanceTotem, setSelectedMaintenanceTotem] = useState<string | null>(null);
  const [selectedMaintenanceAction, setSelectedMaintenanceAction] = useState<string | null>(null);
  const [maintenanceProgress, setMaintenanceProgress] = useState<number>(0);

  // Alert state for notifications
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Register totem form state
  const [totemFormData, setTotemFormData] = useState<TotemFormData>({
    toteId: "",
    status: "offline",
    version: "1.4",
    temperature: 0,
    location: "",
    agencyName: "",
    enabled: true,
    deviceId: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-generate a unique Totem ID on mount if not already set
  useEffect(() => {
    if (!totemFormData.toteId) {
      const uniqueId = "TM" + Math.floor(1000 + Math.random() * 9000);
      setTotemFormData((prev) => ({ ...prev, toteId: uniqueId }));
    }
  }, [totemFormData.toteId]);

  // Fetch kiosks from the API when the component mounts
  useEffect(() => {
    const fetchKiosks = async () => {
      try {
        const response = await axios.get("/api/kiosk");
        // Map the API response to match the Totem interface
        const mappedKiosks = response.data.map((kiosk: any) => ({
          id: kiosk.tote, // API returns the unique identifier as "tote"
          status: kiosk.status,
          version: kiosk.version,
          temperature: kiosk.temperature,
        }));
        setTotems(mappedKiosks);
      } catch (error) {
        console.error("Error fetching kiosks:", error);
        setAlertMessage("Erreur lors de la récupération des kiosks");
        setShowAlert(true);
      }
    };

    fetchKiosks();
  }, []);

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>;
  }

  // Handler for refreshing temperature for a specific totem
  const handleRefresh = async (totemId: string) => {
    try {
      const response = await axios.get("/api/kiosk/temperature");
      const newTemperature = response.data.temperature;
      setTotems((prevTotems) =>
        prevTotems.map((totem) =>
          totem.id === totemId && totem.status === "online" ? { ...totem, temperature: newTemperature } : totem
        )
      );
      setAlertMessage(`Totem ${totemId} refreshed. New temperature: ${newTemperature}°C`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error refreshing temperature:", error);
      setAlertMessage(`Error refreshing Totem ${totemId}`);
      setShowAlert(true);
    }
  };

  // Handler for shutting down a totem (simulate remote shutdown)
  const handleShutdown = async (totemId: string) => {
    try {
      await axios.post("/api/kiosk/shutdown", { totemId });
      setTotems((prevTotems) =>
        prevTotems.map((totem) => (totem.id === totemId ? { ...totem, status: "offline", temperature: 0 } : totem))
      );
      setAlertMessage(`Shutdown command sent to Totem ${totemId}`);
      setShowAlert(true);
    } catch (error) {
      console.error("Error shutting down totem:", error);
      setAlertMessage(`Error shutting down Totem ${totemId}`);
      setShowAlert(true);
    }
  };

  // Handler for executing remote maintenance action
  const handleExecuteMaintenance = async () => {
    if (!selectedMaintenanceTotem || !selectedMaintenanceAction) {
      setAlertMessage("Please select both a Totem and an Action.");
      setShowAlert(true);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/kiosk/maintenance", {
        totemId: selectedMaintenanceTotem,
        action: selectedMaintenanceAction,
      });
      if (selectedMaintenanceAction === "update") {
        setMaintenanceProgress(0);
        const interval = setInterval(() => {
          setMaintenanceProgress((prev) => {
            if (prev >= 1) {
              clearInterval(interval);
              setAlertMessage(
                `Maintenance action "${selectedMaintenanceAction}" completed for Totem ${selectedMaintenanceTotem}`
              );
              setShowAlert(true);
              return 1;
            }
            return prev + 0.1;
          });
        }, 500);
      } else {
        setAlertMessage(
          `Maintenance action "${selectedMaintenanceAction}" executed for Totem ${selectedMaintenanceTotem}`
        );
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error executing maintenance action:", error);
      setAlertMessage(`Error executing maintenance action on Totem ${selectedMaintenanceTotem}`);
      setShowAlert(true);
    }
  };

  // Handler for form input changes
  const handleFormChange = (field: keyof TotemFormData, value: any) => {
    setTotemFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!totemFormData.toteId.trim()) {
      errors.toteId = "Totem ID est requis";
    }

    if (!totemFormData.deviceId.trim()) {
      errors.deviceId = "Device ID est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handler for registering a new totem
  const handleRegisterTotem = async () => {
    if (!validateForm()) {
      setAlertMessage("Veuillez corriger les erreurs dans le formulaire");
      setShowAlert(true);
      return;
    }

    try {
      await axios.post("/api/kiosk/register", totemFormData);

      const newTotem: Totem = {
        id: totemFormData.toteId,
        status: totemFormData.status,
        version: totemFormData.version,
        temperature: totemFormData.temperature,
      };

      setTotems((prev) => [...prev, newTotem]);

      // Reset form and generate a new unique Totem ID for the next registration
      const newUniqueId = "TM" + Math.floor(1000 + Math.random() * 9000);
      setTotemFormData({
        toteId: newUniqueId,
        status: "offline",
        version: "1.4",
        temperature: 0,
        location: "",
        agencyName: "",
        enabled: true,
        deviceId: "",
      });

      setAlertMessage("Totem enregistré avec succès");
      setShowAlert(true);
    } catch (error) {
      console.error("Error registering totem:", error);
      setAlertMessage("Erreur lors de l'enregistrement du totem");
      setShowAlert(true);
    }
  };

  // Render the list of kiosks in the "État des Appareils" tab
  const renderDeviceStatus = () => (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Totem ID</th>
            <th>Status</th>
            <th>Version</th>
            <th>Temperature</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {totems.map((totem) => (
            <tr key={totem.id}>
              <td>{totem.id}</td>
              <td>
                <span className={`admin-status-badge ${totem.status === "online" ? "online" : "offline"}`}>
                  {totem.status}
                </span>
              </td>
              <td>{totem.version}</td>
              <td>
                <div className="admin-temp-display">
                  <IonIcon icon={thermometerOutline} />
                  <span>{totem.status === "online" ? `${totem.temperature}°C` : "N/A"}</span>
                </div>
              </td>
              <td>
                <div className="admin-action-buttons">
                  <button
                    className="admin-icon-button"
                    disabled={totem.status === "offline"}
                    title="Refresh"
                    onClick={() => handleRefresh(totem.id)}
                  >
                    <IonIcon icon={refreshOutline} />
                  </button>
                  <button
                    className="admin-icon-button"
                    disabled={totem.status === "offline"}
                    title="Power"
                    onClick={() => handleShutdown(totem.id)}
                  >
                    <IonIcon icon={powerOutline} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render Remote Maintenance Tab
  const renderRemoteMaintenance = () => (
    <div className="admin-maintenance-container">
      <div className="admin-form-group">
        <label className="admin-form-label">Select Totem</label>
        <div className="admin-select-wrapper">
          <IonSelect
            placeholder="Choose a totem"
            className="admin-select"
            onIonChange={(e) => setSelectedMaintenanceTotem(e.detail.value)}
          >
            {totems.map((totem) => (
              <IonSelectOption key={totem.id} value={totem.id}>
                {totem.id}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Action</label>
        <div className="admin-select-wrapper">
          <IonSelect
            placeholder="Choose an action"
            className="admin-select"
            onIonChange={(e) => setSelectedMaintenanceAction(e.detail.value)}
          >
            <IonSelectOption value="update">Update Software</IonSelectOption>
            <IonSelectOption value="restart">Restart Totem</IonSelectOption>
            <IonSelectOption value="diagnose">Run Diagnostics</IonSelectOption>
          </IonSelect>
        </div>
      </div>

      <button className="admin-action-button" onClick={handleExecuteMaintenance}>
        <IonIcon icon={cloudUploadOutline} />
        <span>Execute Action</span>
      </button>

      {selectedMaintenanceAction === "update" && (
        <div className="admin-progress-card">
          <h3 className="admin-progress-title">Update Progress</h3>
          <div className="admin-progress-container">
            <IonProgressBar value={maintenanceProgress} className="admin-progress-bar"></IonProgressBar>
            <span className="admin-progress-value">{Math.round(maintenanceProgress * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );

  // Render Incident Log Tab
  const renderIncidentLog = () => (
    <div className="admin-incidents-container">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="admin-incident-item"
          onClick={() => {
            setSelectedTotem(`TM00${index + 1}`);
            setIsModalOpen(true);
          }}
        >
          <div className="admin-incident-icon">
            <IonIcon icon={bugOutline} />
          </div>
          <div className="admin-incident-content">
            <h3 className="admin-incident-title">Incident #{1000 + index}</h3>
            <p className="admin-incident-details">
              Totem: TM00{index + 1} | Date: {new Date().toLocaleString()}
            </p>
            <p className="admin-incident-type">
              Type: {index % 2 === 0 ? "Hardware Failure" : "Software Error"}
            </p>
          </div>
          <div className={`admin-incident-badge ${index % 2 === 0 ? "warning" : "critical"}`}>
            {index % 2 === 0 ? "Open" : "Critical"}
          </div>
        </div>
      ))}
    </div>
  );

  // Render Register Totem Tab
  const renderRegisterTotem = () => (
    <div className="admin-register-container">
      <div className="admin-register-form">
        <div className="admin-form-group">
          <label className="admin-form-label">Totem ID</label>
          <IonInput
            className={`admin-input ${formErrors.toteId ? "admin-input-error" : ""}`}
            value={totemFormData.toteId}
            readonly
            placeholder="Entrez l'ID du totem"
          />
          {formErrors.toteId && <div className="admin-error-message">{formErrors.toteId}</div>}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Device ID*</label>
          <IonInput
            className={`admin-input ${formErrors.deviceId ? "admin-input-error" : ""}`}
            value={totemFormData.deviceId}
            onIonChange={(e) => handleFormChange("deviceId", e.detail.value || "")}
            placeholder="Entrez l'ID de l'appareil"
          />
          {formErrors.deviceId && <div className="admin-error-message">{formErrors.deviceId}</div>}
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group admin-form-group-half">
            <label className="admin-form-label">Status</label>
            <div className="admin-select-wrapper">
              <IonSelect
                className="admin-select"
                value={totemFormData.status}
                onIonChange={(e) => handleFormChange("status", e.detail.value)}
              >
                <IonSelectOption value="online">Online</IonSelectOption>
                <IonSelectOption value="offline">Offline</IonSelectOption>
              </IonSelect>
            </div>
          </div>

          <div className="admin-form-group admin-form-group-half">
            <label className="admin-form-label">Version</label>
            <IonInput
              className="admin-input"
              value={totemFormData.version}
              onIonChange={(e) => handleFormChange("version", e.detail.value || "1.4")}
              placeholder="Version du logiciel"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Emplacement</label>
          <IonInput
            className="admin-input"
            value={totemFormData.location}
            onIonChange={(e) => handleFormChange("location", e.detail.value || "")}
            placeholder="Emplacement du totem"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Nom de l'agence</label>
          <IonInput
            className="admin-input"
            value={totemFormData.agencyName}
            onIonChange={(e) => handleFormChange("agencyName", e.detail.value || "")}
            placeholder="Nom de l'agence"
          />
        </div>

        <button className="admin-action-button" onClick={handleRegisterTotem}>
          <IonIcon icon={saveOutline} />
          <span>Enregistrer le Totem</span>
        </button>
      </div>
    </div>
  );

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        <SidebarAdmin currentPage="Totems" />
        <div className="admin-dashboard-content">
          <AdminPageHeader
            title="Gestion des Totems Interactifs"
            subtitle="Surveillez et gérez vos totems à distance"
          />
          <div className="admin-content-card">
            <div className="admin-tabs">
              <button className={`admin-tab ${activeTab === "status" ? "active" : ""}`} onClick={() => setActiveTab("status")}>
                État des Appareils
              </button>
              <button className={`admin-tab ${activeTab === "maintenance" ? "active" : ""}`} onClick={() => setActiveTab("maintenance")}>
                Maintenance à Distance
              </button>
              <button className={`admin-tab ${activeTab === "incidents" ? "active" : ""}`} onClick={() => setActiveTab("incidents")}>
                Journal d'Incidents
              </button>
              <button className={`admin-tab ${activeTab === "register" ? "active" : ""}`} onClick={() => setActiveTab("register")}>
                Enregistrer Totem
              </button>
            </div>
            <div className="admin-tab-content">
              {activeTab === "status" && renderDeviceStatus()}
              {activeTab === "maintenance" && renderRemoteMaintenance()}
              {activeTab === "incidents" && renderIncidentLog()}
              {activeTab === "register" && renderRegisterTotem()}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Détails de l'Incident - {selectedTotem}</h2>
          <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
            <IonIcon icon={closeCircleOutline} />
          </button>
        </div>
        <div className="admin-modal-content">
          <div className="admin-form-group">
            <label className="admin-form-label">Description de l'Incident</label>
            <IonTextarea rows={10} placeholder="Entrez les détails de l'incident ici..." className="admin-textarea" />
          </div>
          <button className="admin-action-button">Enregistrer le Rapport d'Incident</button>
        </div>
      </IonModal>

      {/* Alert for notifications */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Notification"}
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default InteractiveTotemManagement;
