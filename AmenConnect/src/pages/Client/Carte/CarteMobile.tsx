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
import { motion, AnimatePresence } from "framer-motion"
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
  TypeCarte: string
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
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [longPressProgress, setLongPressProgress] = useState(0)

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const longPressDuration = 500 // milliseconds

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cardsFromProfile = profile.cartes.map((card, index) => {
        const account = profile.comptes.find((compte) => compte._id === card.comptesId)
        return {
          id: `card-${index}`,
          cardNumber: card.CardNumber,
          cardHolder: card.CardHolder,
          expiryDate: card.ExpiryDate,
          cardType: card.TypeCarte,
          balance: account?.solde || 0,
          pendingTransactions: 0,
          monthlySpendingLimit: 5000,
          monthlySpending: 0,
          withdrawalLimit: 1000,
          withdrawalAmount: 0,
        }
      })
      setCards(cardsFromProfile)
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

  const handleLongPressStart = () => {
    setIsLongPressing(true)
    setLongPressProgress(0)
    longPressTimer.current = setInterval(() => {
      setLongPressProgress((prev) => {
        if (prev >= 100) {
          clearInterval(longPressTimer.current as NodeJS.Timeout)
          navigateCards()
          return 0
        }
        return prev + 10
      })
    }, longPressDuration / 10)
  }

  const handleLongPressEnd = () => {
    setIsLongPressing(false)
    setLongPressProgress(0)
    if (longPressTimer.current) {
      clearInterval(longPressTimer.current)
    }
  }

  const navigateCards = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length)
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
      <IonContent fullscreen>
        <div className="status-bar"></div>

        <motion.h1
          className="mes-cartes"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes cartes
        </motion.h1>

        {/* Card Display */}
        <div className="card-container">
          <div className="card-wrapper">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`credit-card ${index === currentCardIndex ? "active" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onTouchStart={handleLongPressStart}
                onTouchEnd={handleLongPressEnd}
                onMouseDown={handleLongPressStart}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
              >
                <div className="card-header">
                  <span className="card-type">{card.cardType}</span>
                  <button className="toggle-visibility" onClick={toggleCardNumber}>
                    <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                <div className="card-body">
                  <IonImg src="../puce.png" className="chip" alt="Card chip" />
                  <div className="card-number">{formatCardNumber(card.cardNumber, isCardNumberVisible)}</div>
                  <div className="card-holder">{card.cardHolder}</div>
                </div>
                {isLongPressing && (
                  <div className="long-press-indicator">
                    <div className="long-press-progress" style={{ width: `${longPressProgress}%` }}></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

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
              <h2 className="section-title">Détails de la carte</h2>
              {[
                { label: "Titulaire de la carte", value: cards[currentCardIndex]?.cardHolder },
                { label: "Type de la carte", value: "Carte bancaire" },
                { label: "Plafond retrait", value: "TND 1 000.000" },
                { label: "Plafond total", value: "TND 5 000.000" },
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
              <h2 className="section-title">Encours de la carte</h2>
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
              <h2 className="section-title">Dernières opérations</h2>
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

