// QRScanner.tsx
import React, { useState } from "react";
import { IonButton, IonContent, IonPage, IonLoading, IonToast } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const QRScanner: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        // Extract the session parameter from the scanned URL
        const url = new URL(data);
        const sessionId = url.searchParams.get("session");
        if (!sessionId) {
          setMessage("Session ID not found in QR code.");
          return;
        }

        setLoading(true);
        const response = await fetch("/api/qr-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ensures mobile's token cookie is sent
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();
        setLoading(false);
        if (response.ok) {
          // Instead of redirecting, inform the user to return to the kiosk.
          setMessage("QR session authenticated. Please return to the kiosk.");
        } else {
          setMessage(result.message || "Failed to authenticate QR session.");
        }
      } catch (err) {
        setLoading(false);
        setMessage("Error processing QR code.");
        console.error(err);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setMessage("QR Scanner error.");
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>QR Scanner</h1>
        <QrReader
          delay={300}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result?.getText());
            }
            if (error) {
              handleError(error);
            }
          }}
          style={{ width: "100%" }}
        />
        <IonButton onClick={() => history.goBack()}>Retour</IonButton>
        <IonLoading isOpen={loading} message="Authenticating..." />
        <IonToast
          isOpen={!!message}
          onDidDismiss={() => setMessage("")}
          message={message}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default QRScanner;
