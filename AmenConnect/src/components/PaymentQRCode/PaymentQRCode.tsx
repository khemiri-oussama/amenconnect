"use client"

import type React from "react"
import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/react"
import { closeCircleOutline, shareOutline } from "ionicons/icons"
import { motion } from "framer-motion"

interface PaymentData {
  transactionId: string
  amount: number
  cardId: string
  merchant?: string
}

interface PaymentQRCodeProps {
  paymentData: PaymentData
  onClose: () => void
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ paymentData: initialPaymentData, onClose }) => {
  const [paymentData, setPaymentData] = useState<PaymentData>(initialPaymentData)
  const [editMode, setEditMode] = useState(false)

  // Convert payment data to a JSON string that will be encoded in the QR code
  const qrValue = JSON.stringify(paymentData)

  const handleAmountChange = (event: CustomEvent) => {
    const newAmount = Number.parseFloat(event.detail.value || "0")
    setPaymentData((prev) => ({ ...prev, amount: newAmount }))
  }

  const shareQRCode = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Demande de paiement",
          text: `Demande de paiement de ${paymentData.amount} TND`,
          url: window.location.href,
        })
      } else {
        alert("Le partage n'est pas pris en charge sur votre appareil")
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="qr-payment-container"
    >
      <IonCard className="qr-card">
        <IonCardHeader>
          <div className="qr-header">
            <IonCardTitle>Demande de paiement</IonCardTitle>
            <IonButton fill="clear" onClick={onClose}>
              <IonIcon icon={closeCircleOutline} />
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          {editMode ? (
            <div className="amount-edit">
              <IonItem>
                <IonLabel position="floating">Montant (TND)</IonLabel>
                <IonInput type="number" value={paymentData.amount} onIonChange={handleAmountChange} />
              </IonItem>
              <IonButton expand="block" onClick={() => setEditMode(false)}>
                Confirmer
              </IonButton>
            </div>
          ) : (
            <>
              <div className="amount-display">
                <span className="amount-label">Montant:</span>
                <span className="amount-value">{paymentData.amount} TND</span>
                <IonButton fill="clear" size="small" onClick={() => setEditMode(true)}>
                  Modifier
                </IonButton>
              </div>
              <div className="qr-code-container">
                <QRCodeSVG value={qrValue} size={220} level="H" />
              </div>
              <div className="qr-actions">
                <IonButton expand="block" color="primary" onClick={shareQRCode}>
                  <IonIcon slot="start" icon={shareOutline} />
                  Partager
                </IonButton>
              </div>
            </>
          )}
        </IonCardContent>
      </IonCard>
    </motion.div>
  )
}

export default PaymentQRCode

