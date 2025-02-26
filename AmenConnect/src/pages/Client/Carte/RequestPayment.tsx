"use client"

import type React from "react"
import { useState } from "react"
import { IonInput, IonButton, IonIcon } from "@ionic/react"
import { qrCodeOutline } from "ionicons/icons"
import { QRCodeSVG } from "qrcode.react"

interface RequestPaymentProps {
  card: {
    cardNumber: string
    cardHolder: string
  }
}

const RequestPayment: React.FC<RequestPaymentProps> = ({ card }) => {
  const [amount, setAmount] = useState("")
  const [showQR, setShowQR] = useState(false)

  const generateQRCode = () => {
    if (amount) {
      setShowQR(true)
    }
  }

  const paymentData = {
    cardNumber: card.cardNumber.slice(-4),
    cardHolder: card.cardHolder,
    amount: amount,
  }

  return (
    <div className="request-payment">
      <h2 className="section-title text-lg font-semibold mb-4">Demander un paiement</h2>
      <div className="input-container">
        <IonInput
          type="number"
          placeholder="Montant"
          value={amount}
          onIonChange={(e) => setAmount(e.detail.value!)}
          className="bg-gray-800 rounded-lg mb-4"
        />
        <IonButton expand="block" onClick={generateQRCode} disabled={!amount} className="mt-2">
          <IonIcon icon={qrCodeOutline} slot="start" />
          Générer le QR Code
        </IonButton>
      </div>
      {showQR && (
        <div className="qr-container mt-6 bg-white p-4 rounded-lg flex flex-col items-center">
          <QRCodeSVG value={JSON.stringify(paymentData)} size={200} />
          <p className="mt-4 text-center text-gray-800">Scannez ce QR code pour effectuer le paiement</p>
        </div>
      )}
    </div>
  )
}

export default RequestPayment

