"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { closeOutline, flashlightOutline, cameraReverseOutline } from "ionicons/icons";
import { motion } from "framer-motion";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import "./QRPaymentScanner.css";

interface QRPaymentScannerProps {
  onClose: () => void;
}

const QRPaymentScanner: React.FC<QRPaymentScannerProps> = ({ onClose }) => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [currentCamera, setCurrentCamera] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);

  useEffect(() => {
    // Initialize scanner
    const html5QrCode = new Html5Qrcode("qr-reader");
    setScanner(html5QrCode);

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setAvailableCameras(devices);
          setCurrentCamera(devices[0].id);
        } else {
          setToastMessage("Aucune caméra détectée");
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err);
        setToastMessage("Erreur d'accès à la caméra");
        setShowToast(true);
      });

    // Cleanup on unmount
    return () => {
      if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
        html5QrCode.stop().catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  useEffect(() => {
    // Start scanning when camera is selected
    if (scanner && currentCamera && !isScanning) {
      startScanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanner, currentCamera]);

  const startScanner = () => {
    if (!scanner || !currentCamera) return;

    setIsScanning(true);
    setIsCameraReady(false);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    scanner
      .start(
        currentCamera,
        config,
        async (decodedText) => {
          // When a QR code is successfully scanned, stop scanning and process the payment
          try {
            await scanner.stop();
            setIsScanning(false);
            await handleProcessPayment(decodedText);
          } catch (err) {
            console.error("Error stopping scanner:", err);
          }
        },
        (errorMessage) => {
          // Ignore errors during scanning as they're usually just frames without a QR code
          console.log(errorMessage);
        }
      )
      .then(() => {
        setIsCameraReady(true);
      })
      .catch((err) => {
        console.error("Error starting scanner:", err);
        setIsScanning(false);
        setToastMessage("Erreur lors de l'initialisation de la caméra");
        setShowToast(true);
      });
  };

  const handleProcessPayment = async (decodedText: string) => {
    let paymentData;
    try {
      // Try to parse the decoded text as JSON.
      paymentData = JSON.parse(decodedText);
    } catch (err) {
      console.error("Erreur lors de l'analyse du QR code:", err);
      setToastMessage("QR Code invalide. Veuillez réessayer avec un code correct.");
      setShowToast(true);
      return;
    }

    try {
      setProcessing(true);
      // At this point, paymentData should be an object containing the payment details.
      // Send the payment data to your backend endpoint.
      const response = await fetch("/api/payments/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authorization token if required.
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        setToastMessage("Paiement traité avec succès.");
      } else {
        setToastMessage(result.message || "Erreur lors du traitement du paiement.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      setToastMessage("Erreur lors de l'appel à l'API de paiement.");
    } finally {
      setProcessing(false);
      setShowToast(true);
    }
  };

  const toggleTorch = () => {
    if (scanner && isCameraReady) {
      // Html5Qrcode doesn't expose a direct way to toggle torch in TypeScript.
      // Show a toast informing the user.
      setToastMessage("La fonctionnalité torche n'est pas disponible dans cette version");
      setShowToast(true);
    }
  };

  const switchCamera = async () => {
    if (scanner && availableCameras.length > 1) {
      // Stop current scanner
      if (isScanning) {
        await scanner.stop();
        setIsScanning(false);
      }

      // Find next camera in the list
      const currentIndex = availableCameras.findIndex((camera) => camera.id === currentCamera);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      setCurrentCamera(availableCameras[nextIndex].id);
    } else {
      setToastMessage("Aucune caméra supplémentaire disponible");
      setShowToast(true);
    }
  };

  const handleClose = async () => {
    if (scanner && isScanning) {
      try {
        await scanner.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    onClose();
  };

  return (
    <motion.div
      className="qr-scanner-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <IonCard className="scanner-card">
        <IonCardHeader>
          <div className="scanner-header">
            <IonCardTitle>Scanner un code de paiement</IonCardTitle>
            <IonButton fill="clear" onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="scanner-viewport">
            <div id="qr-reader" className="qr-reader"></div>
            <div className="scanner-overlay">
              <div className="scanner-target"></div>
            </div>
            {!isCameraReady && (
              <div className="scanner-loading">
                <IonSpinner name="circular" />
                <p>Initialisation de la caméra...</p>
              </div>
            )}
          </div>

          <div className="scanner-controls">
            <IonButton fill="outline" onClick={toggleTorch} disabled={!isCameraReady}>
              <IonIcon icon={flashlightOutline} />
            </IonButton>
            <IonButton fill="outline" onClick={switchCamera} disabled={availableCameras.length <= 1}>
              <IonIcon icon={cameraReverseOutline} />
            </IonButton>
          </div>

          {processing && (
            <div className="processing-indicator">
              <IonSpinner name="circular" />
              <p>Traitement du paiement...</p>
            </div>
          )}

          <div className="scanner-instructions">
            <p>Placez le code QR dans le cadre pour le scanner</p>
          </div>
        </IonCardContent>
      </IonCard>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
      />
    </motion.div>
  );
};

export default QRPaymentScanner;
