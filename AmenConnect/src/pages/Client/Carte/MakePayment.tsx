"use client"

import type React from "react"
import { useState } from "react"
import { IonButton, IonIcon, IonInput, IonToast, IonAlert } from "@ionic/react"
import { qrCodeOutline, cashOutline, closeCircleOutline } from "ionicons/icons"
import { QrReader } from "react-qr-reader"

interface MakePaymentProps {
  card: {
    cardNumber: string
    cardHolder: string
  }
}

const MakePayment: React.FC<MakePaymentProps> = ({ card }) => {
  const [showScanner, setShowScanner] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showPermissionModal, setShowPermissionModal] = useState(false)

  const handleScanResult = (result: any, error: any) => {
    if (result) {
      try {
        setScannedData(JSON.parse(result.text))
        setShowScanner(false)
      } catch (err) {
        console.error("Error parsing scanned data", err)
        setToastMessage("Erreur lors de la lecture du QR code. Veuillez réessayer.")
        setShowToast(true)
      }
    }
    if (error) {
      console.error(error)
      setToastMessage("Erreur lors de la lecture du QR code. Veuillez réessayer.")
      setShowToast(true)
    }
  }

  const handleManualPayment = () => {
    console.log("Manual payment for amount:", amount)
    // Implement your actual payment logic here
  }

  const handleShowScanner = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })
      if (permissionStatus.state === "granted") {
        setShowScanner(true)
      } else if (permissionStatus.state === "prompt") {
        setShowPermissionModal(true)
      } else {
        setToastMessage(
          "L'accès à la caméra a été bloqué. Veuillez l'autoriser dans les paramètres de votre navigateur.",
        )
        setShowToast(true)
      }
    } catch (err) {
      console.error("Error checking camera permission:", err)
      setToastMessage("Erreur lors de la vérification des permissions de la caméra. Veuillez réessayer.")
      setShowToast(true)
    }
  }

  return (
    <div className="make-payment">
      <h2 className="section-title text-lg font-semibold mb-4">Effectuer un paiement</h2>

      {!showScanner && !scannedData && (
        <div className="button-container flex flex-col gap-4">
          <IonButton expand="block" onClick={handleShowScanner} className="h-12">
            <IonIcon icon={qrCodeOutline} slot="start" />
            Scanner un QR Code
          </IonButton>
          <IonButton expand="block" onClick={() => setScannedData(null)} className="h-12">
            <IonIcon icon={cashOutline} slot="start" />
            Paiement manuel
          </IonButton>
        </div>
      )}

      {showScanner && (
        <div className="scanner-container relative">
          <QrReader
            onResult={handleScanResult}
            constraints={{ facingMode: "environment" }}
            videoId="qr-video"
            scanDelay={500}
            className="w-full h-64 rounded-lg overflow-hidden"
          />
          <IonButton
            fill="clear"
            onClick={() => setShowScanner(false)}
            className="close-scanner absolute top-2 right-2"
          >
            <IonIcon icon={closeCircleOutline} />
          </IonButton>
        </div>
      )}

      {scannedData && (
        <div className="payment-details bg-gray-800 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Détails du paiement</h3>
          <p className="text-sm text-gray-400">Destinataire: {scannedData.cardHolder}</p>
          <p className="text-sm text-gray-400">Montant: {scannedData.amount} TND</p>
          <IonButton expand="block" onClick={() => console.log("Payment confirmed")} className="mt-4">
            Confirmer le paiement
          </IonButton>
        </div>
      )}

      {!showScanner && !scannedData && (
        <div className="manual-payment mt-4">
          <IonInput
            type="number"
            placeholder="Montant"
            value={amount}
            onIonChange={(e) => setAmount(e.detail.value!)}
            className="bg-gray-800 rounded-lg mb-4"
          />
          <IonButton expand="block" onClick={handleManualPayment} disabled={!amount} className="h-12">
            Effectuer le paiement
          </IonButton>
        </div>
      )}

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={5000}
        position="bottom"
      />

      <IonAlert
        isOpen={showPermissionModal}
        onDidDismiss={() => setShowPermissionModal(false)}
        header={"Accès à la caméra"}
        message={"Voulez-vous autoriser l'accès à la caméra ?"}
        buttons={[
          {
            text: "Refuser",
            role: "cancel",
            handler: () => {
              setShowPermissionModal(false)
            },
          },
          {
            text: "Autoriser",
            handler: async () => {
              try {
                await navigator.mediaDevices.getUserMedia({ video: true })
                setShowPermissionModal(false)
                setShowScanner(true)
              } catch (err) {
                console.error("Error accessing camera:", err)
                setToastMessage("Impossible d'accéder à la caméra.")
                setShowToast(true)
                setShowPermissionModal(false)
              }
            },
          },
        ]}
      />
    </div>
  )
}

export default MakePayment

