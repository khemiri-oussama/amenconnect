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
  IonButton,
  IonAlert,
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonToast,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
} from "@ionic/react"
import {
  eyeOutline,
  eyeOffOutline,
  qrCodeOutline,
  scanOutline,
  cardOutline,
  chevronForwardOutline,
  chevronBackOutline,
  closeOutline,
  walletOutline,
  lockClosedOutline,
  lockOpenOutline,
  informationCircleOutline,
  arrowUpOutline,
  arrowDownOutline,
  timeOutline,
  ellipsisHorizontalOutline,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./CarteMobile.css"
import NavMobile from "../../../components/NavMobile"
import { useAuth } from "../../../AuthContext"
import PaymentQRCode from "../../../components/PaymentQRCode/PaymentQRCode";
import QRPaymentScanner from "../../../components/PaymentQRCode/QRPaymentScanner";

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
        {
          id: "4",
          date: "05 févr. 2024",
          merchant: "Pharmacie Centrale",
          amount: 42.8,
          type: "debit",
          category: "Santé",
          icon: "💊",
        },
        {
          id: "5",
          date: "03 févr. 2024",
          merchant: "Cinéma Pathé",
          amount: 28.0,
          type: "debit",
          category: "Loisirs",
          icon: "🎬",
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
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [showCardActions, setShowCardActions] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // State for QR Payment action
  const [qrMode, setQrMode] = useState<string>("")
  const [scannedData, setScannedData] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCardDetails, setShowCardDetails] = useState(false)

  const cardContainerRef = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)
  const currentX = useRef<number | null>(null)

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
          monthlySpending: 2350,
          withdrawalLimit: 1000,
          withdrawalAmount: 450,
          TypeCarte: card.TypeCarte,
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
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const formatCardNumber = (cardNumber: string, isVisible: boolean): string => {
    if (!cardNumber) return ""
    if (isVisible) {
      return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
    } else {
      const masked = cardNumber.slice(0, 4) + " •••• •••• " + cardNumber.slice(-4)
      return masked
    }
  }

  const navigateCards = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length)
    } else {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
    }
  }

  // Touch handlers for card swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    currentX.current = startX.current
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return
    currentX.current = e.touches[0].clientX

    const diff = (currentX.current - startX.current) / 3 // Reduce the movement for smoother effect
    if (cardContainerRef.current) {
      cardContainerRef.current.style.transform = `translateX(${diff}px)`
    }
  }

  const handleTouchEnd = () => {
    if (startX.current === null || currentX.current === null) return

    const diff = currentX.current - startX.current

    // Reset the transform
    if (cardContainerRef.current) {
      cardContainerRef.current.style.transform = ""
    }

    // If the swipe was significant enough, navigate cards
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateCards("prev")
      } else {
        navigateCards("next")
      }
    }

    startX.current = null
    currentX.current = null
  }

  // --- QR Payment Handlers ---
  const currentCard = cards[currentCardIndex]
  const paymentData = {
    transactionId: "tx-" + new Date().getTime(),
    amount: 100,
    cardId: currentCard?.id || "",
    merchant: currentCard?.cardHolder || "",
  }

  const handleScan = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText)
      console.log("Scanned Payment Data:", data)
      setScannedData(data)
      setShowConfirmation(true)
      setQrMode("")
    } catch (error) {
      console.error("Error parsing scanned data:", error)
      setToastMessage("Format de code QR invalide. Veuillez réessayer.")
      setShowToast(true)
    }
  }

  const handleError = (error: any) => {
    console.error("Scanner error:", error)
    setToastMessage("Erreur lors du scan. Veuillez réessayer.")
    setShowToast(true)
  }

  const handleConfirmPayment = async () => {
    try {
      // Simulate payment processing
      setToastMessage("Paiement en cours de traitement...")
      setShowToast(true)

      setTimeout(() => {
        setToastMessage("Paiement effectué avec succès!")
        setShowToast(true)
        setShowConfirmation(false)

        // Update the card balance (simulated)
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === currentCardIndex ? { ...card, balance: card.balance - (scannedData?.amount || 0) } : card,
          ),
        )

        // Add the transaction to the list (simulated)
        const newTransaction: Transaction = {
          id: new Date().getTime().toString(),
          date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          merchant: scannedData?.merchant || "Paiement QR",
          amount: scannedData?.amount || 0,
          type: "debit",
          category: "Paiement QR",
          icon: "📱",
        }

        setTransactions((prev) => [newTransaction, ...prev])
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setToastMessage("Erreur lors du paiement. Veuillez réessayer.")
      setShowToast(true)
    }
  }

  const toggleCardLock = () => {
    setIsCardLocked(!isCardLocked)
    setToastMessage(isCardLocked ? "Carte débloquée avec succès" : "Carte bloquée avec succès")
    setShowToast(true)
    setShowCardActions(false)
  }

  if (authLoading || isLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding-horizontal">
          <div className="status-bar"></div>
          <motion.h1
            className="mes-cartes"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mes cartes
          </motion.h1>

          <div className="card-container">
            <IonCard className="skeleton-card">
              <IonCardContent>
                <IonSkeletonText animated style={{ width: "40%", height: "20px" }} />
                <IonSkeletonText animated style={{ width: "100%", height: "30px", marginTop: "20px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                  <IonSkeletonText animated style={{ width: "40%", height: "20px" }} />
                  <IonSkeletonText animated style={{ width: "30%", height: "20px" }} />
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          <IonSegment mode="ios" value="details" className="custom-segment">
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

          <div className="skeleton-content">
            {[1, 2, 3].map((item) => (
              <div key={item} className="skeleton-item">
                <IonSkeletonText animated style={{ width: "60%", height: "20px" }} />
                <IonSkeletonText animated style={{ width: "40%", height: "20px" }} />
              </div>
            ))}
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
            <IonIcon icon={informationCircleOutline} className="error-icon" />
            <h2>Oups!</h2>
            <p>{error}</p>
            <IonButton expand="block" onClick={() => window.location.reload()}>
              Réessayer
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="status-bar"></div>

        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mes-cartes">Mes cartes</h1>
          <IonButton fill="clear" className="info-button" onClick={() => setShowCardDetails(true)}>
            <IonIcon icon={informationCircleOutline} />
          </IonButton>
        </motion.div>

        {/* Card Display */}
        <div
          className="card-container"
          ref={cardContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card-navigation">
            {cards.length > 1 && (
              <>
                <button className="nav-button prev" onClick={() => navigateCards("prev")} aria-label="Carte précédente">
                  <IonIcon icon={chevronBackOutline} />
                </button>
                <button className="nav-button next" onClick={() => navigateCards("next")} aria-label="Carte suivante">
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </>
            )}
          </div>

          <div className="card-wrapper">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`credit-card ${index === currentCardIndex ? "active" : ""} ${isCardLocked ? "locked" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === currentCardIndex ? 1 : 0,
                  scale: index === currentCardIndex ? 1 : 0.9,
                  rotateY: isCardLocked ? [0, 10, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  rotateY: { repeat: isCardLocked ? Number.POSITIVE_INFINITY : 0, repeatType: "mirror", duration: 1.5 },
                }}
              >
                <div className="card-header">
                  <span className="card-type">{card.cardType}</span>
                  <button
                    className="toggle-visibility"
                    onClick={toggleCardNumber}
                    aria-label={isCardNumberVisible ? "Masquer le numéro de carte" : "Afficher le numéro de carte"}
                  >
                    <IonIcon icon={isCardNumberVisible ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                <div className="card-body">
                  <div className="card-chip-row">
                    <IonImg src="/assets/chip.png" className="chip" alt="Puce de carte" />
                    {isCardLocked && (
                      <div className="card-lock-indicator">
                        <IonIcon icon={lockClosedOutline} />
                        <span>Bloquée</span>
                      </div>
                    )}
                  </div>
                  <div className="card-number">{formatCardNumber(card.cardNumber, isCardNumberVisible)}</div>
                  <div className="card-info-row">
                    <div className="card-holder-col">
                      <span className="card-label">TITULAIRE</span>
                      <div className="card-holder">{card.cardHolder}</div>
                    </div>
                    <div className="card-expiry-col">
                      <span className="card-label">EXPIRE</span>
                      <div className="card-expiry">{card.expiryDate}</div>
                    </div>
                  </div>
                </div>
                {isCardLocked && (
                  <div className="card-lock-overlay">
                    <IonIcon icon={lockClosedOutline} className="lock-icon" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {cards.length > 1 && (
            <div className="card-pagination">
              {cards.map((_, index) => (
                <span
                  key={index}
                  className={`pagination-dot ${index === currentCardIndex ? "active" : ""}`}
                  onClick={() => setCurrentCardIndex(index)}
                ></span>
              ))}
            </div>
          )}
        </div>

        {/* Card Balance Display */}
        <motion.div
          className="card-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="balance-label">Solde disponible</span>
          <span className="balance-amount">{formatCurrency(cards[currentCardIndex]?.balance || 0)}</span>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <IonButton
            className="action-button"
            fill="outline"
            onClick={() => setQrMode(qrMode === "request" ? "" : "request")}
          >
            <IonIcon slot="start" icon={qrCodeOutline} />
            Demander
          </IonButton>
          <IonButton
            className="action-button"
            fill="outline"
            onClick={() => setQrMode(qrMode === "scan" ? "" : "scan")}
          >
            <IonIcon slot="start" icon={scanOutline} />
            Payer
          </IonButton>
          <IonButton className="action-button" fill="outline" onClick={() => setShowCardActions(!showCardActions)}>
            <IonIcon slot="start" icon={ellipsisHorizontalOutline} />
            Plus
          </IonButton>
        </motion.div>

        {/* Card Actions Popover */}
        <AnimatePresence>
          {showCardActions && (
            <motion.div
              className="card-actions-popover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <IonButton expand="block" fill="clear" className="action-item" onClick={toggleCardLock}>
                <IonIcon slot="start" icon={isCardLocked ? lockOpenOutline : lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                className="action-item"
                onClick={() => {
                  setShowCardActions(false)
                  setShowCardDetails(true)
                }}
              >
                <IonIcon slot="start" icon={informationCircleOutline} />
                Détails de la carte
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                className="action-item close-actions"
                onClick={() => setShowCardActions(false)}
              >
                <IonIcon slot="start" icon={closeOutline} />
                Fermer
              </IonButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Segments */}
        <IonSegment
          mode="ios"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(String(e.detail.value ?? "details"))}
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

        {/* Segments Content */}
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
                {
                  label: "Titulaire de la carte",
                  value: cards[currentCardIndex]?.cardHolder,
                  icon: cardOutline,
                },
                {
                  label: "Type de la carte",
                  value: cards[currentCardIndex]?.TypeCarte,
                  icon: walletOutline,
                },
                {
                  label: "Plafond mensuel",
                  value: formatCurrency(cards[currentCardIndex]?.monthlySpendingLimit || 0),
                  icon: arrowUpOutline,
                  progress: cards[currentCardIndex]?.monthlySpending / cards[currentCardIndex]?.monthlySpendingLimit,
                },
                {
                  label: "Plafond retrait",
                  value: formatCurrency(cards[currentCardIndex]?.withdrawalLimit || 0),
                  icon: arrowDownOutline,
                  progress: cards[currentCardIndex]?.withdrawalAmount / cards[currentCardIndex]?.withdrawalLimit,
                },
              ].map((detail, index) => (
                <motion.div
                  key={index}
                  className="detail-item"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="detail-icon">
                    <IonIcon icon={detail.icon} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{detail.label}</span>
                    <span className="detail-value">{detail.value}</span>
                    {detail.progress !== undefined && (
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${detail.progress * 100}%` }}></div>
                      </div>
                    )}
                  </div>
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
                <div className="encours-icon">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="encours-content">
                  <span className="encours-label">Transactions en attente</span>
                  <span className="encours-value">
                    {formatCurrency(cards[currentCardIndex]?.pendingTransactions || 0)}
                  </span>
                </div>
              </div>

              {cards[currentCardIndex]?.pendingTransactions ? (
                <div className="pending-transactions">
                  <h3>Transactions en attente</h3>
                  <p>Aucune transaction en attente pour le moment.</p>
                </div>
              ) : (
                <div className="no-pending-transactions">
                  <IonIcon icon={timeOutline} className="no-pending-icon" />
                  <p>Aucune transaction en attente pour le moment.</p>
                </div>
              )}
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
                  <div className="operation-icon">
                    <span>{transaction.icon}</span>
                  </div>
                  <div className="operation-info">
                    <span className="operation-merchant">{transaction.merchant}</span>
                    <span className="operation-date">{transaction.date}</span>
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

        {/* QR Payment Components */}
        <AnimatePresence>
          {qrMode === "request" && <PaymentQRCode paymentData={paymentData} onClose={() => setQrMode("")} />}
          {qrMode === "scan" && (
            <QRPaymentScanner onScan={handleScan} onError={handleError} onClose={() => setQrMode("")} />
          )}
        </AnimatePresence>

        {/* Card Details Modal */}
        <IonModal isOpen={showCardDetails} onDidDismiss={() => setShowCardDetails(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowCardDetails(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
              <IonTitle>Détails de la carte</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="card-full-details">
              <div className="card-detail-section">
                <h3>Informations générales</h3>
                <div className="detail-row">
                  <span className="detail-key">Numéro de carte</span>
                  <span className="detail-value">{formatCardNumber(cards[currentCardIndex]?.cardNumber, true)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Titulaire</span>
                  <span className="detail-value">{cards[currentCardIndex]?.cardHolder}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Date d'expiration</span>
                  <span className="detail-value">{cards[currentCardIndex]?.expiryDate}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Type de carte</span>
                  <span className="detail-value">{cards[currentCardIndex]?.TypeCarte}</span>
                </div>
              </div>

              <div className="card-detail-section">
                <h3>Limites et plafonds</h3>
                <div className="detail-row">
                  <span className="detail-key">Plafond mensuel</span>
                  <span className="detail-value">
                    {formatCurrency(cards[currentCardIndex]?.monthlySpendingLimit || 0)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Dépenses du mois</span>
                  <span className="detail-value">{formatCurrency(cards[currentCardIndex]?.monthlySpending || 0)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Plafond retrait</span>
                  <span className="detail-value">{formatCurrency(cards[currentCardIndex]?.withdrawalLimit || 0)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Retraits du mois</span>
                  <span className="detail-value">{formatCurrency(cards[currentCardIndex]?.withdrawalAmount || 0)}</span>
                </div>
              </div>

              <div className="card-actions">
                <IonButton expand="block" color={isCardLocked ? "success" : "danger"} onClick={toggleCardLock}>
                  <IonIcon slot="start" icon={isCardLocked ? lockOpenOutline : lockClosedOutline} />
                  {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

        {/* Confirmation Alert for Payment */}
        <IonAlert
          isOpen={showConfirmation}
          onDidDismiss={() => setShowConfirmation(false)}
          header={"Confirmer le paiement"}
          message={`Voulez-vous payer ${formatCurrency(scannedData?.amount || 0)} à ${scannedData?.merchant || "Marchand inconnu"}?`}
          buttons={[
            {
              text: "Annuler",
              role: "cancel",
              cssClass: "alert-button-cancel",
            },
            {
              text: "Confirmer",
              handler: handleConfirmPayment,
              cssClass: "alert-button-confirm",
            },
          ]}
          cssClass="payment-confirmation-alert"
        />

        {/* Toast Messages */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
      </IonContent>
      <NavMobile currentPage="carte" />
    </IonPage>
  )
}

export default CarteMobile

