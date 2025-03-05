"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { IonButton, IonContent, IonPage, IonLoading, IonToast, IonIcon } from "@ionic/react"
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode"
import { useHistory } from "react-router-dom"
import { arrowBack, scanOutline } from "ionicons/icons"
import "./qrscanner.css"

const QRScanner: React.FC = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info")
  const [scanning, setScanning] = useState(true)
  const [scanSuccess, setScanSuccess] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scanning) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            videoConstraints: { facingMode: { exact: "environment" } },
          },
          false,
        )

        scannerRef.current.render(
          async (decodedText) => {
            handleScan(decodedText)
          },
          (errorMessage) => {
            console.warn("QR Scanner Error:", errorMessage)
          },
        )
      }, 100)

      return () => {
        clearTimeout(timer)
        scannerRef.current?.clear().catch(console.error)
      }
    }
  }, [scanning])

  const handleScan = async (data: string) => {
    if (!data) return

    // Visual feedback for successful scan
    setScanSuccess(true)
    setScanning(false)
    setLoading(true)

    try {
      const url = new URL(data)
      const sessionId = url.searchParams.get("session")

      if (!sessionId) {
        setMessage("Invalid QR code. Session ID not found.")
        setMessageType("error")
        setLoading(false)
        return
      }

      const response = await fetch("/api/qr-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()
      setLoading(false)

      if (response.ok) {
        setMessage("Authentication successful! Please return to the kiosk.")
        setMessageType("success")
      } else {
        setMessage(result.message || "Authentication failed. Please try again.")
        setMessageType("error")
      }
    } catch (err) {
      console.error(err)
      setMessage("Invalid QR code format. Please scan a valid code.")
      setMessageType("error")
      setLoading(false)
    }
  }

  const resetScanner = () => {
    setScanSuccess(false)
    setScanning(true)
    setMessage("")
  }

  return (
    <IonPage className="qr-scanner-page">
      <IonContent className="ion-padding qr-scanner-container">
        <div className="qr-scanner-header">
          <h1>QR Scanner</h1>
          <p>Position the QR code within the frame to login</p>
        </div>

        {scanning && (
          <div ref={viewportRef} className="qr-scanner-viewport">
            <div id="qr-reader"></div>
            <div className="scanner-overlay"></div>
            <div className="scanner-laser"></div>
            <div className="scanner-corners">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
          </div>
        )}

        {!scanning && (
          <div className={`status-card ${messageType} ${scanSuccess ? "scan-success" : ""}`}>
            <div className={`status-icon ${messageType}`}>
              {messageType === "success" ? "✓" : messageType === "error" ? "✕" : "i"}
            </div>
            <div className="status-message">{message}</div>
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Authenticating...</span>
          </div>
        )}

        <div className="button-container">
          <IonButton className="qr-scanner-button back-button" onClick={() => history.goBack()} fill="outline">
            <IonIcon icon={arrowBack} slot="start" />
            Back
          </IonButton>

          {!scanning && (
            <IonButton className="qr-scanner-button scan-again-button" onClick={resetScanner}>
              <IonIcon icon={scanOutline} slot="start" />
              Scan Again
            </IonButton>
          )}
        </div>

        <div className="scanner-instructions">
          <div className="instruction-item">
            <div className="instruction-icon">1</div>
            <div className="instruction-text">Open the QR code from your kiosk</div>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">2</div>
            <div className="instruction-text">Position it within the frame</div>
          </div>
          <div className="instruction-item">
            <div className="instruction-icon">3</div>
            <div className="instruction-text">Hold steady until scan completes</div>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Authenticating..." cssClass="custom-loading" />

        <IonToast
          isOpen={!!message}
          onDidDismiss={() => setMessage("")}
          message={message}
          duration={3000}
          position="bottom"
          cssClass={`qr-scanner-page-toast ${messageType}-toast`}
        />
      </IonContent>
    </IonPage>
  )
}

export default QRScanner

