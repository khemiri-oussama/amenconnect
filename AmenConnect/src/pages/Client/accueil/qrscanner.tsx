"use client"

import type React from "react"
import { useState } from "react"
import { IonButton, IonContent, IonPage, IonLoading, IonToast } from "@ionic/react"
import { useHistory } from "react-router-dom"
import { QrReader } from "react-qr-reader"
import "./qrscanner.css" // Import the CSS file

const QRScanner: React.FC = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info")
  const [scanning, setScanning] = useState(true) // Controls whether the camera is active
  const [scanSuccess, setScanSuccess] = useState(false)

  const handleScan = async (data: string | null) => {
    if (data && scanning) {
      try {
        const url = new URL(data)
        const sessionId = url.searchParams.get("session")
        if (!sessionId) {
          setMessage("Session ID not found in QR code.")
          setMessageType("error")
          return
        }

        // Turn off the camera scanning
        setScanning(false)
        setScanSuccess(true)

        setLoading(true)
        const response = await fetch("/api/qr-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ensures mobile's token cookie is sent
          body: JSON.stringify({ sessionId }),
        })

        const result = await response.json()
        setLoading(false)
        if (response.ok) {
          setMessage("QR session authenticated. Please return to the kiosk.")
          setMessageType("success")
        } else {
          setMessage(result.message || "Failed to authenticate QR session.")
          setMessageType("error")
        }
      } catch (err) {
        setLoading(false)
        setMessage("Error processing QR code.")
        setMessageType("error")
        console.error(err)
      }
    }
  }

  const handleError = (err: any) => {
    console.error(err)
    setMessage("QR Scanner error.")
    setMessageType("error")
  }

  const resetScanner = () => {
    setScanning(true)
    setScanSuccess(false)
    setMessage("")
  }

  return (
    <IonPage className="qr-scanner-page">
      <IonContent className="ion-padding qr-scanner-container">
        <div className="qr-scanner-header">
          <h1>QR Scanner</h1>
          <p>Scan the QR code to login</p>
        </div>

        {scanning && (
          <div className={`qr-scanner-viewport ${scanSuccess ? "scan-success" : ""}`}>
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  handleScan(result.getText())
                }
                if (error) {
                  handleError(error)
                }
              }}
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: "100%", height: "100%" }}
              videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="scanner-overlay"></div>
            <div className="scanner-laser"></div>
          </div>
        )}

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
  )
}

export default QRScanner

