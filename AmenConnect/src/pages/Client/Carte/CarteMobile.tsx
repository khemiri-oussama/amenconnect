import type React from "react"
import { useState, useEffect } from "react"
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
import {
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons"
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
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cardFromProfile = profile.cartes[0]
      const account = profile.comptes.find(
        (compte) => compte._id === cardFromProfile.comptesId
      )
      setCardDetails({
        cardNumber: cardFromProfile.CardNumber,
        cardHolder: cardFromProfile.CardHolder,
        expiryDate: cardFromProfile.ExpiryDate,
        cardType: "Carte bancaire",
        balance: account?.solde || 0,
        pendingTransactions: 0,
        monthlySpendingLimit: 5000,
        monthlySpending: 0,
        withdrawalLimit: 1000,
        withdrawalAmount: 0,
      })
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

        {/* Card Display */}
        <motion.div
          className="card-display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="credit-card">
            <div className="card-header">
              <span className="card-type">{cardDetails?.cardType}</span>
              <button className="toggle-visibility" onClick={toggleCardNumber}>
                <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
              </button>
            </div>
            <div className="card-body">
              <IonImg src="../puce.png" className="chip" />
              <motion.div className="card-number" animate={{ opacity: isCardNumberVisible ? 1 : 0.5 }}>
                {isCardNumberVisible
                  ? cardDetails?.cardNumber
                  : cardDetails?.cardNumber.replace(/\d{4}(?=.)/g, "•••• ")}
              </motion.div>
              <div className="card-holder">{cardDetails?.cardHolder}</div>
            </div>
            <div className="card-footer">
              <div className="expiry">
                <span>Expire à </span>
                <span>{cardDetails?.expiryDate}</span>
              </div>
              <div className="bank-logo">
                <IonImg src="../amen_logo.png" className="bank-name" />
              </div>
            </div>
          </div>
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
                { label: "Titulaire de la carte", value: cardDetails?.cardHolder },
                { label: "Type de la carte", value: cardDetails?.cardType },
                { label: "Plafond retrait", value: formatCurrency(cardDetails?.withdrawalLimit || 0) },
                { label: "Plafond total", value: formatCurrency(cardDetails?.monthlySpendingLimit || 0) },
                { label: "Date d'expiration", value: cardDetails?.expiryDate },
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
                <span className="amount">{formatCurrency(cardDetails?.balance || 0)}</span>
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