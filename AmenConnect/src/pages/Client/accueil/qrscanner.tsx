"use client";

import { useEffect, useRef, useState } from "react";
import { IonButton, IonContent, IonPage, IonLoading, IonToast } from "@ionic/react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"; // ✅ Fixed import
import { useHistory } from "react-router-dom";
import "./qrscanner.css"; // Ensure you have a CSS file for styling

const QRScanner: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], // ✅ Fixed issue here
        },
        false // ✅ Verbose mode set to false
      );

      scannerRef.current.render(
        async (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          console.warn("QR Scanner Error:", errorMessage);
        }
      );
    }

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [scanning]);

  const handleScan = async (data: string) => {
    if (!data) return;

    setScanning(false);
    setLoading(true);

    try {
      const url = new URL(data);
      const sessionId = url.searchParams.get("session");

      if (!sessionId) {
        setMessage("Session ID not found in QR code.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/qr-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("QR session authenticated. Please return to the kiosk.");
        setMessageType("success");
      } else {
        setMessage(result.message || "Failed to authenticate QR session.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error processing QR code.");
      setMessageType("error");
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setMessage("");
  };

  return (
    <IonPage className="qr-scanner-page">
      <IonContent className="ion-padding qr-scanner-container">
        <div className="qr-scanner-header">
          <h1>QR Scanner</h1>
          <p>Scan the QR code to login</p>
        </div>

        {scanning && <div id="qr-reader" className="qr-scanner-viewport"></div>}

        {!scanning && <div className={`status-message ${messageType}`}>{message}</div>}

        {loading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Authenticating...</span>
          </div>
        )}

        <div className="button-container">
          <IonButton className="qr-scanner-button" onClick={() => history.goBack()}>
            Back
          </IonButton>

          {!scanning && (
            <IonButton className="qr-scanner-button" onClick={resetScanner}>
              Scan Again
            </IonButton>
          )}
        </div>

        <IonLoading isOpen={loading} message="Authenticating..." cssClass="custom-loading" />

        <IonToast
          isOpen={!!message}
          onDidDismiss={() => setMessage("")}
          message={message}
          duration={3000}
          cssClass={`qr-scanner-page-toast ${messageType}-toast`}
        />
      </IonContent>
    </IonPage>
  );
};

export default QRScanner;
