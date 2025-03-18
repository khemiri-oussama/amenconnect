"use client";

import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonInput, IonButton, IonIcon, IonText, IonToast } from "@ionic/react";
import { checkmarkCircleOutline, businessOutline, locationOutline, barcodeOutline } from "ionicons/icons";
import "./kiosk-setup.css";

const KioskSetup: React.FC = () => {
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [agencyName, setAgencyName] = useState<string>("");
  const [agencyLocation, setAgencyLocation] = useState<string>("");
  const [showToast, setShowToast] = useState<{ message: string; color: string } | null>(null);
  const [errors, setErrors] = useState<{ serialNumber?: string; agencyName?: string; agencyLocation?: string; }>({});

  useEffect(() => {
    async function fetchDeviceSerial() {
      try {
          // generate or retrieve a persistent pseudo-UUID from localStorage.
          const storedUuid = localStorage.getItem("pcUuid");
          if (storedUuid) {
            setSerialNumber(storedUuid);
          } else {
            const newUuid = crypto.randomUUID();
            localStorage.setItem("pcUuid", newUuid);
            setSerialNumber(newUuid);
          }
        
      } catch (error) {
        console.error("Error fetching device serial number", error);
        // Fallback to generating a pseudo-UUID
        const storedUuid = localStorage.getItem("pcUuid");
        if (storedUuid) {
          setSerialNumber(storedUuid);
        } else {
          const newUuid = crypto.randomUUID();
          localStorage.setItem("pcUuid", newUuid);
          setSerialNumber(newUuid);
        }
      }
    }
    fetchDeviceSerial();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { serialNumber?: string; agencyName?: string; agencyLocation?: string; } = {};

    if (!serialNumber.trim()) {
      newErrors.serialNumber = "Veuillez saisir le numéro de série";
    }
    if (!agencyName.trim()) {
      newErrors.agencyName = "Veuillez saisir le nom de l'agence";
    }
    if (!agencyLocation.trim()) {
      newErrors.agencyLocation = "Veuillez saisir l'emplacement de l'agence";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateForm()) {
      const kioskData = {
        SN: serialNumber,
        agencyName,
        location: agencyLocation,
        status: "offline",
        version: "0",
        temperature: 0,
        enabled: true,
      };
      try {
        const response = await fetch("/api/kiosk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(kioskData),
        });
      
        if (!response.ok) {
          let errorMessage = "Une erreur est survenue.(Contacter IT).";
          
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
      
          throw new Error(errorMessage);
        }
      
        const data = await response.json();
        console.log("Kiosk created:", data);
        setShowToast({ message: "Configuration enregistrée avec succès!", color: "success" });
      
      } catch (error: unknown) {
        console.error("Error saving kiosk data:", error);
        
        let errorMessage = "Impossible de se connecter au serveur.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
      
        setShowToast({ message: errorMessage, color: "danger" });
      }
      
  }};
  
  

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="kiosk-container">
          <div className="background-white"></div>
          <div className="background-svg">
            <svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
              <path d="M1080 0C1080 0 800 150 600 450C400 750 300 900 150 1200C0 1500 0 1920 0 1920H1080V0Z" fill="#F0F4FF" />
            </svg>
          </div>

          <div className="kiosk-content animate-fade-in">
            <div className="kiosk-logo">
              <img src="/amen_logo.png" alt="Logo" className="logo-img" />
            </div>

            <h1 className="kiosk-title animate-staggered">Configuration Initiale</h1>
            <p className="kiosk-question animate-staggered">Veuillez configurer votre appareil</p>

            <div className="kiosk-form animate-staggered">
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <div className="input-icon">
                    <IonIcon icon={barcodeOutline} />
                  </div>
                  <div className="input-field">
                    <label>Numéro de Série</label>
                    <IonInput
                      value={serialNumber}
                      onIonChange={(e) => setSerialNumber(e.detail.value!)}
                      placeholder="Veuillez saisir le numéro de série"
                      className={errors.serialNumber ? "has-error" : ""}
                    />
                    {errors.serialNumber && (
                      <IonText color="danger" className="error-message">
                        {errors.serialNumber}
                      </IonText>
                    )}
                  </div>
                </div>

                <div className="input-container">
                  <div className="input-icon">
                    <IonIcon icon={businessOutline} />
                  </div>
                  <div className="input-field">
                    <label>Nom de l'Agence</label>
                    <IonInput
                      value={agencyName}
                      onIonChange={(e) => setAgencyName(e.detail.value!)}
                      placeholder="Veuillez saisir le nom de l'agence"
                      className={errors.agencyName ? "has-error" : ""}
                    />
                    {errors.agencyName && (
                      <IonText color="danger" className="error-message">
                        {errors.agencyName}
                      </IonText>
                    )}
                  </div>
                </div>

                <div className="input-container">
                  <div className="input-icon">
                    <IonIcon icon={locationOutline} />
                  </div>
                  <div className="input-field">
                    <label>Emplacement de l'Agence</label>
                    <IonInput
                      value={agencyLocation}
                      onIonChange={(e) => setAgencyLocation(e.detail.value!)}
                      placeholder="Veuillez saisir l'emplacement de l'agence"
                      className={errors.agencyLocation ? "has-error" : ""}
                    />
                    {errors.agencyLocation && (
                      <IonText color="danger" className="error-message">
                        {errors.agencyLocation}
                      </IonText>
                    )}
                  </div>
                </div>

                <div className="button-container">
                  <IonButton type="submit" expand="block" className="kiosk-btn">
                    <IonIcon icon={checkmarkCircleOutline} slot="start" />
                    Soumettre
                  </IonButton>
                </div>
              </form>
            </div>
          </div>
        </div>

        <IonToast
  isOpen={!!showToast}
  onDidDismiss={() => setShowToast(null)}
  message={showToast?.message || ""}
  duration={3000}
  color={showToast?.color || "danger"}
  position="top"
/>


      </IonContent>
    </IonPage>
  );
};

export default KioskSetup;
