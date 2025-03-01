"use client";

import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

interface QRPaymentScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

const QRPaymentScanner: React.FC<QRPaymentScannerProps> = ({ onScan, onError, onClose }) => {
  // Called whenever a QR code is detected
  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data);
    }
  };

  // Called if an error occurs during scanning
  const handleError = (err: any) => {
    onError(err);
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Close button to exit scanning */}
      <IonButton
        onClick={onClose}
        style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}
      >
        <IonIcon icon={closeOutline} />
      </IonButton>

      {/* QR reader component */}

    </div>
  );
};

export default QRPaymentScanner;
