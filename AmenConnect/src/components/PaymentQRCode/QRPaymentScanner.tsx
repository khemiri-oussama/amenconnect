"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode"
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonSpinner,
  IonToast,
} from "@ionic/react"
import { closeOutline, scanOutline, cameraReverseOutline } from "ionicons/icons"
import { motion } from "framer-motion"

interface QRPaymentScannerProps {
  onScan: (decodedText: string) => void
  onError: (error: any) => void
  onClose: () => void
}

const QRPaymentScanner: React.FC<QRPaymentScannerProps> = ({ onScan, onError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [cameraId, setCameraId] = useState<string>("")
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([])

  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const scannerContainerId = "qr-reader"

  // Initialize scanner with improved configuration
  const initializeScanner = useCallback(async () => {
    if (!scannerInitialized) {
      try {
        scannerRef.current = new Html5QrcodeScanner(
          scannerContainerId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
            videoConstraints: {
              facingMode: "environment", // Use back camera by default
            },
          },
          false,
        )
        setScannerInitialized(true)

        // Get available cameras
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const cameras = devices
            .filter((device) => device.kind === "videoinput")
            .map((camera) => ({
              id: camera.deviceId,
              label: camera.label || `Camera ${camera.deviceId.slice(0, 4)}`,
            }))
          setAvailableCameras(cameras)
          if (cameras.length > 0) {
            setCameraId(cameras[0].id)
          }
        } catch (error) {
          console.error("Error getting cameras:", error)
        }
      } catch (error) {
        console.error("Error initializing scanner:", error)
        showErrorToast("Erreur d'initialisation du scanner")
        onError(error)
      }
    }
  }, [scannerInitialized, onError])

  useEffect(() => {
    initializeScanner()
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (error) {
          console.error("Error clearing scanner:", error)
        }
      }
    }
  }, [initializeScanner])

  const showErrorToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const startScanner = useCallback(async () => {
    if (scannerRef.current && !isScanning) {
      setIsScanning(true)

      try {
        await requestCameraPermission()

        scannerRef.current.render(
          (decodedText: string) => {
            handleScanSuccess(decodedText)
          },
          (errorMessage: string) => {
            console.warn(`QR scan error: ${errorMessage}`)
            if (errorMessage.includes("permission") || errorMessage.includes("denied")) {
              showErrorToast("Veuillez autoriser l'accès à la caméra")
            }
          },
        )

        // Add timeout to check if camera starts
        setTimeout(() => {
          const videoElement = document.querySelector(`#${scannerContainerId} video`) as HTMLVideoElement
          if (!videoElement || videoElement.readyState === 0) {
            showErrorToast("La caméra n'a pas pu démarrer")
            setIsScanning(false)
          }
        }, 3000)
      } catch (error) {
        console.error("Error starting scanner:", error)
        showErrorToast("Erreur lors du démarrage du scanner")
        setIsScanning(false)
      }
    }
  }, [isScanning, showErrorToast])

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
    } catch (error) {
      console.error("Camera permission error:", error)
      showErrorToast("Veuillez autoriser l'accès à la caméra")
      throw error
    }
  }

  const handleScanSuccess = (decodedText: string) => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
        // Validate QR code format
        const data = JSON.parse(decodedText)
        if (!data.amount || !data.merchant) {
          throw new Error("Invalid QR code format")
        }
        onScan(decodedText)
      } catch (error) {
        console.error("Error processing QR code:", error)
        showErrorToast("Format de QR code invalide")
        startScanner() // Restart scanning
      }
    }
  }

  const switchCamera = async () => {
    if (availableCameras.length < 2) return

    const currentIndex = availableCameras.findIndex((camera) => camera.id === cameraId)
    const nextIndex = (currentIndex + 1) % availableCameras.length
    const nextCameraId = availableCameras[nextIndex].id

    if (scannerRef.current) {
      try {
        await scannerRef.current.clear()
        setCameraId(nextCameraId)
        // Reinitialize scanner with new camera
        await initializeScanner()
        startScanner()
      } catch (error) {
        console.error("Error switching camera:", error)
        showErrorToast("Erreur lors du changement de caméra")
      }
    }
  }

  const handleClose = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
      } catch (error) {
        console.error("Error clearing scanner:", error)
      }
    }
    onClose()
  }

  return (
    <motion.div
      className="qr-scanner-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IonModal isOpen={true} onDidDismiss={handleClose} className="qr-scanner-modal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleClose}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Scanner un code de paiement</IonTitle>
            {availableCameras.length > 1 && (
              <IonButtons slot="end">
                <IonButton onClick={switchCamera}>
                  <IonIcon icon={cameraReverseOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="scanner-container">
            <div className="scanner-instructions">
              <IonIcon icon={scanOutline} className="scan-icon" />
              <p>Placez le code QR dans le cadre pour scanner</p>
            </div>

            {!scannerInitialized && (
              <div className="scanner-loading">
                <IonSpinner name="circular" />
                <p>Initialisation de la caméra...</p>
              </div>
            )}

            <div id={scannerContainerId} className="qr-scanner"></div>

            <div className="scanner-footer">
              <IonButton
                expand="block"
                color="primary"
                onClick={startScanner}
                className="retry-button"
                disabled={isScanning}
              >
                {isScanning ? "Scanner en cours..." : "Autoriser la caméra"}
              </IonButton>
              <IonButton expand="block" onClick={handleClose} color="medium">
                Annuler
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="bottom"
        color="danger"
      />
    </motion.div>
  )
}

export default QRPaymentScanner

