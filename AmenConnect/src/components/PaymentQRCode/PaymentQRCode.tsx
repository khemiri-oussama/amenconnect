"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/react"
import { closeOutline, shareOutline, downloadOutline } from "ionicons/icons"
import { motion } from "framer-motion"
import { QRCodeCanvas } from "qrcode.react"
import "./PaymentQRCode.css"

interface PaymentData {
  transactionId: string
  amount?: number
  cardId: string
  merchant: string
}

interface PaymentQRCodeProps {
  paymentData: PaymentData
  onClose: () => void
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ paymentData, onClose }) => {
  const [qrValue, setQrValue] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [amount, setAmount] = useState<string>(paymentData.amount?.toString() || "")

  useEffect(() => {
    // Create QR code data with the current amount
    updateQRCode()
  }, [amount, paymentData])

  const updateQRCode = () => {
    try {
      // Build a valid JSON object for the QR code payload
      const updatedPaymentData = {
        transactionId: paymentData.transactionId,
        amount: amount ? Number.parseFloat(amount) : 0,
        cardId: paymentData.cardId,
        merchant: paymentData.merchant,
      }
      const qrData = JSON.stringify(updatedPaymentData)
      setQrValue(qrData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error generating QR code:", error)
      setToastMessage("Erreur lors de la génération du code QR")
      setShowToast(true)
      setIsLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  const handleShare = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setToastMessage("Veuillez saisir un montant valide")
      setShowToast(true)
      return
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Demande de paiement",
          text: `Demande de paiement de ${formatCurrency(Number.parseFloat(amount))}`,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        setToastMessage("Le partage n'est pas pris en charge par votre navigateur")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Error sharing:", error)
      setToastMessage("Erreur lors du partage")
      setShowToast(true)
    }
  }

  const handleDownload = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setToastMessage("Veuillez saisir un montant valide")
      setShowToast(true)
      return
    }

    try {
      const canvas = document.getElementById("payment-qr-code") as HTMLCanvasElement
      if (canvas) {
        const url = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.href = url
        link.download = `payment-request-${paymentData.transactionId}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Error downloading QR code:", error)
      setToastMessage("Erreur lors du téléchargement du code QR")
      setShowToast(true)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <motion.div
      className="qr-payment-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <IonCard className="qr-card">
        <IonCardHeader>
          <div className="qr-header">
            <IonCardTitle>Demande de paiement</IonCardTitle>
            <IonButton fill="clear" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="amount-input-container">
            <label htmlFor="payment-amount">Montant à demander:</label>
            <div className="input-wrapper">
              <input
                id="payment-amount"
                type="text"
                inputMode="decimal"
                className="amount-input"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                autoFocus
              />
              <span className="currency-label">TND</span>
            </div>
          </div>

          <div className="qr-code-container">
            {isLoading ? (
              <IonSpinner name="circular" />
            ) : (
              <QRCodeCanvas
                id="payment-qr-code"
                value={qrValue}
                size={200}
                level="H"
                includeMargin={true}
                className="payment-qr-code"
              />
            )}
          </div>

          <p className="qr-instructions">Présentez ce code QR à scanner pour recevoir un paiement</p>

          <div className="qr-actions">
            <IonButton expand="block" onClick={handleShare}>
              <IonIcon slot="start" icon={shareOutline} />
              Partager
            </IonButton>
            <IonButton expand="block" fill="outline" onClick={handleDownload}>
              <IonIcon slot="start" icon={downloadOutline} />
              Télécharger
            </IonButton>
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
  )
}

export default PaymentQRCode
