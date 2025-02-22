"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonImg,
  IonSpinner,
  IonButton,
} from "@ionic/react"
import { eyeOutline, eyeOffOutline } from "ionicons/icons"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import "./CarteMobile.css"
import NavMobile from "../../../components/NavMobile"
import { useAuth } from "../../../AuthContext"

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  type: "debit" | "credit"
  category: string
  icon: string
}

interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: string
  balance: number
  pendingTransactions: number
  monthlySpendingLimit: number
  monthlySpending: number
  withdrawalLimit: number
  withdrawalAmount: number
}

interface Card extends CardDetails {
  id: string
}

const mockFetchTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          date: "09 févr. 2024",
          merchant: "Carrefour Market",
          amount: 156.7,
          type: "debit",
          category: "Courses",
          icon: "🛒",
        },
        {
          id: "2",
          date: "08 févr. 2024",
          merchant: "Virement Reçu - Salaire",
          amount: 3500.0,
          type: "credit",
          category: "Revenus",
          icon: "💰",
        },
        {
          id: "3",
          date: "07 févr. 2024",
          merchant: "Restaurant Le Petit Jardin",
          amount: 89.5,
          type: "debit",
          category: "Restauration",
          icon: "🍽️",
        },
      ])
    }, 1000)
  })
}

const CarteMobile: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const [selectedSegment, setSelectedSegment] = useState<string>("details")
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardContainerRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cardsFromProfile = profile.cartes.map((card, index) => {
        const account = profile.comptes.find((compte) => compte._id === card.comptesId)
        return {
          id: `card-${index}`,
          cardNumber: card.CardNumber,
          cardHolder: card.CardHolder,
          expiryDate: card.ExpiryDate,
          cardType: "Carte bancaire",
          balance: account?.solde || 0,
          pendingTransactions: 0,
          monthlySpendingLimit: 5000,
          monthlySpending: 0,
          withdrawalLimit: 1000,
          withdrawalAmount: 0,
        }
      })
      setCards(cardsFromProfile)
      setDragConstraints({ left: -((cardsFromProfile.length - 1) * 300), right: 0 })
    }
  }, [profile])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const transactionsData = await mockFetchTransactions()
        setTransactions(transactionsData)
      } catch (err) {
        setError("Une erreur s'est produite lors du chargement des données.")
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const formatCardNumber = (cardNumber: string, isVisible: boolean): string => {
    if (!cardNumber) return ""
    if (isVisible) {
      return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ") // Add space every 4 digits
    } else {
      // Show only last 4 digits with •••• prefix
      const masked = cardNumber.slice(0, -4).replace(/\d/g, "•") + cardNumber.slice(-4)
      return masked.replace(/(.{4})/g, "$1 ").trim() // Format with spaces
    }
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const dragDistance = info.offset.x
    const dragDirection = dragDistance < 0 ? -1 : 1

    if (Math.abs(dragDistance) > threshold) {
      const newIndex = currentCardIndex - dragDirection
      if (newIndex >= 0 && newIndex < cards.length) {
        setCurrentCardIndex(newIndex)
      }
    }
  }

  const cardVariants = {
    center: (index: number) => ({
      rotateY: 0,
      scale: 1,
      x: 0,
      zIndex: cards.length - index,
      transition: { duration: 0.5 },
    }),
    left: (index: number) => ({
      rotateY: 45,
      scale: 0.8,
      x: -300,
      zIndex: cards.length - index - 1,
      transition: { duration: 0.5 },
    }),
    right: (index: number) => ({
      rotateY: -45,
      scale: 0.8,
      x: 300,
      zIndex: cards.length - index - 1,
      transition: { duration: 0.5 },
    }),
  }

  const getCardPosition = (cardIndex: number) => {
    if (cardIndex === currentCardIndex) return "center"
    if (cardIndex < currentCardIndex) return "left"
    return "right"
  }

  if (authLoading || isLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding-horizontal">
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Chargement des données...</p>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  if (error) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding-horizontal">
          <div className="error-container">
            <p>{error}</p>
            <IonButton onClick={() => window.location.reload()}>Réessayer</IonButton>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal">
        <div className="status-bar"></div>

        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes cartes
        </motion.h1>

        {/* Updated Card Display */}
        <motion.div className="card-container">
          <motion.div className="card-wrapper" drag="x" dragConstraints={dragConstraints} onDragEnd={handleDragEnd}>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className="credit-card"
                custom={index}
                variants={cardVariants}
                animate={getCardPosition(index)}
              >
                <div className="card-header">
                  <span className="card-type">{card.cardType}</span>
                  <button className="toggle-visibility" onClick={toggleCardNumber}>
                    <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                <div className="card-body">
                  <IonImg src="../puce.png" className="chip" />
                  <motion.div className="card-number" animate={{ opacity: isCardNumberVisible ? 1 : 0.5 }}>
                    {formatCardNumber(card.cardNumber, isCardNumberVisible)}
                  </motion.div>
                  <div className="card-holder">{card.cardHolder}</div>
                </div>
                <div className="card-footer">
                  <div className="expiry">
                    <span>Expire à </span>
                    <span>{card.expiryDate}</span>
                  </div>
                  <div className="bank-logo">
                    <IonImg src="../amen_logo.png" className="bank-name" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Segments */}
        <IonSegment
          mode="ios"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
          className="custom-segment"
        >
          <IonSegmentButton value="encours">
            <IonLabel>Encours</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="details">
            <IonLabel>Détails</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="operations">
            <IonLabel>Opérations</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Card Details */}
        <AnimatePresence mode="wait">
          {selectedSegment === "details" && (
            <motion.div
              key="details"
              className="card-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Détails de la carte</h2>
              {[
                { label: "Titulaire de la carte", value: cards[currentCardIndex]?.cardHolder },
                { label: "Type de la carte", value: cards[currentCardIndex]?.cardType },
                { label: "Plafond retrait", value: formatCurrency(cards[currentCardIndex]?.withdrawalLimit || 0) },
                { label: "Plafond total", value: formatCurrency(cards[currentCardIndex]?.monthlySpendingLimit || 0) },
                { label: "Date d'expiration", value: cards[currentCardIndex]?.expiryDate },
              ].map((detail, index) => (
                <motion.div
                  key={index}
                  className="detail-item"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="detail-label">{detail.label}</span>
                  <span className="detail-value">{detail.value}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
          {selectedSegment === "encours" && (
            <motion.div
              key="encours"
              className="card-encours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Encours de la carte</h2>
              <div className="encours-amount">
                <span>Montant disponible</span>
                <span className="amount">{formatCurrency(cards[currentCardIndex]?.balance || 0)}</span>
              </div>
            </motion.div>
          )}
          {selectedSegment === "operations" && (
            <motion.div
              key="operations"
              className="card-operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Dernières opérations</h2>
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="operation-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="operation-info">
                    <span className="operation-date">{transaction.date}</span>
                    <span className="operation-description">{transaction.merchant}</span>
                  </div>
                  <span className={`operation-amount ${transaction.type === "debit" ? "negative" : "positive"}`}>
                    {transaction.type === "debit" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
      <NavMobile currentPage="carte" />
    </IonPage>
  )
}

export default CarteMobile

