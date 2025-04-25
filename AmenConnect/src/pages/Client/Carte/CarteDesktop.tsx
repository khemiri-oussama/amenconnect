"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  IonImg,
  IonSpinner,
} from "@ionic/react"
import {
  shieldOutline,
  notificationsOutline,
  lockClosedOutline,
  downloadOutline,
  chevronForwardOutline,
  chevronBackOutline,
  cardOutline,
} from "ionicons/icons"
import { motion, AnimatePresence } from "framer-motion"
import "./CarteDesktop.css"
import Navbar from "../../../components/Navbar"
import { useAuth, type Carte, type Compte } from "../../../AuthContext"
// Import the useCarte hook from your CarteContext
import { useCarte } from "../../../CarteContext"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import LoadingProgressBar from "../../../components/LoadingProgressBar"
// Add this interface definition at the top of the file, after the imports
interface CreditCardTransaction {
  _id: string
  transactionDate: string
  amount: number
  currency: string
  merchant: string
  status: string
  description: string
}

const CarteDesktop: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const { updateCarteStatus } = useCarte() 

  const [activeTab, setActiveTab] = useState("operations")
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState<Carte | null>(null)
  const [accountDetails, setAccountDetails] = useState<Compte | null>(null)
  const [transactions, setTransactions] = useState<CreditCardTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New state for card navigation
  const [allCards, setAllCards] = useState<Carte[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      // Store all cards
      setAllCards(profile.cartes)

      // Set the first card as default
      const cardFromProfile = profile.cartes[0]
      setCardDetails(cardFromProfile)
      // Use a case-insensitive comparison:
      setIsCardLocked(cardFromProfile.cardStatus?.toLowerCase() !== "active")
      setTransactions(cardFromProfile.creditCardTransactions || [])

      // Find the associated account
      const associatedAccount = profile.comptes.find((compte) => compte._id === cardFromProfile.comptesId)
      setAccountDetails(associatedAccount || null)
    }
    setIsLoading(false)
  }, [profile])

  const changeCard = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < allCards.length) {
      // Set slide direction for animation
      setSlideDirection(newIndex > currentCardIndex ? "left" : "right")
      setCurrentCardIndex(newIndex)

      const newCard = allCards[newIndex]

      // Update card details
      setCardDetails(newCard)
      setIsCardLocked(newCard.cardStatus?.toLowerCase() !== "active")
      setTransactions(newCard.creditCardTransactions || [])

      // Update associated account
      const associatedAccount = profile?.comptes.find((compte) => compte._id === newCard.comptesId)
      setAccountDetails(associatedAccount || null)
    }
  }

  const goToNextCard = () => {
    if (currentCardIndex < allCards.length - 1) {
      changeCard(currentCardIndex + 1)
    }
  }

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      changeCard(currentCardIndex - 1)
    }
  }

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  // Updated toggleCardLock function that calls the API
  const toggleCardLock = async () => {
    if (!cardDetails) return

    // Determine the new status using a case-insensitive check
    const currentStatus = cardDetails.cardStatus?.toLowerCase()
    const newStatus = currentStatus === "active" ? "Bloquer" : "Active"
    try {
      // Call the API to update the card status
      await updateCarteStatus(cardDetails._id, newStatus)
      // Update local state based on the new status
      setIsCardLocked(newStatus.toLowerCase() !== "active")
      setCardDetails((prev) => (prev ? { ...prev, cardStatus: newStatus } : prev))

      // Update the card in allCards array
      setAllCards((prevCards) => {
        return prevCards.map((card) => {
          if (card._id === cardDetails._id) {
            return { ...card, cardStatus: newStatus }
          }
          return card
        })
      })
    } catch (err) {
      console.error("Failed to update card status:", err)
      // Optionally, display an error notification to the user here.
    }
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      // Use compact notation for larger numbers if needed
    }).format(amount).replace(/٫/g, ",");
  };
// Add these imports at the top with other imports


// Replace the existing handleDownloadStatement function with this:
const handleDownloadStatement = async () => {
  try {
    if (!cardDetails || !transactions.length || !accountDetails) {
      throw new Error("Les données ne sont pas disponibles")
    }

    // PDF configuration
    const defaultBankBranding = {
      name: "Amen Bank",
      logo: "/amen_logo.png",
      primaryColor: [0, 51, 102] as [number, number, number],
      secondaryColor: [0, 85, 165] as [number, number, number],
      address: ["Avenue Mohamed V", "Tunis 1002", "Tunisie"],
      website: "www.amenbank.com.tn",
      phone: "(+216) 71 148 000",
    }



    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Header
    const headerHeight = 30
    doc.setFillColor(...defaultBankBranding.primaryColor)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), headerHeight, "F")
    
    try {
      const img = new Image()
      img.src = defaultBankBranding.logo
      doc.addImage(img, "PNG", 10, 5, 40, 20)
    } catch (error) {
      console.error("Error loading logo:", error)
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(255, 255, 255)
    doc.text("Relevé de Carte", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    })

    // Card information
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 20, 15, {
      align: "right",
    })

    // Main content
    doc.setFont("helvetica")
    doc.setTextColor(0, 0, 0)

    // Card Details
    autoTable(doc, {
      startY: headerHeight + 10,
      head: [["Détails de la Carte", "Valeur"]],
      body: [
        ["Titulaire", cardDetails.CardHolder],
        ["Numéro de Carte", `**** **** **** ${cardDetails.CardNumber.slice(-4)}`],
        ["Date d'expiration", cardDetails.ExpiryDate],
        ["Type de Carte", cardDetails.TypeCarte],
        ["Statut", cardDetails.cardStatus?"Active" : "Bloquée"],
      ],
      theme: "grid",
      headStyles: {
        fillColor: defaultBankBranding.primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
    })

    // Limits
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Limites", "Utilisé", "Disponible"]],
      body: [
        [
          "Dépenses mensuelles",
          formatCurrency(cardDetails.monthlyExpenses?.current || 0),
          formatCurrency((cardDetails.monthlyExpenses?.limit || 0) - (cardDetails.monthlyExpenses?.current || 0)),
        ],
        [
          "Retraits DAB",
          formatCurrency(cardDetails.atmWithdrawal?.current || 0),
          formatCurrency((cardDetails.atmWithdrawal?.limit || 0) - (cardDetails.atmWithdrawal?.current || 0)),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: defaultBankBranding.primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
    })

    // Transactions
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Date", "Marchand", "Montant", "Statut"]],
      body: transactions.map((t) => [
        new Date(t.transactionDate).toLocaleDateString(),
        t.merchant,
        formatCurrency(t.amount),
        t.status,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: defaultBankBranding.primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "center" },
      },
      bodyStyles: {
        fontSize: 10,
      },
      styles: {
        cellPadding: 3,
      },
    })

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(defaultBankBranding.address.join(", "), 10, footerY)
    doc.text(
      `Contact: ${defaultBankBranding.phone} | ${defaultBankBranding.website}`,
      doc.internal.pageSize.getWidth() / 2,
      footerY,
      { align: "center" }
    )

    // Save PDF
    doc.save(`releve-carte-${cardDetails.CardNumber.slice(-4)}-${new Date().getTime()}.pdf`)
  } catch (error) {
    console.error("Erreur lors de la génération du relevé:", error)
  }
}

if (authLoading || isLoading) {
  return (
    <IonPage>
      <LoadingProgressBar />
    </IonPage>
  )
}

  if (error) {
    return (
      <IonPage className="carte-desktop">
        <IonContent className="carte-desktop__content">
          <div className="carte-desktop__error">
            <p>{error}</p>
            <IonButton onClick={() => window.location.reload()}>Réessayer</IonButton>
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage className="carte-desktop">
      <IonHeader>
        <IonToolbar>
          <Navbar currentPage="carte" />
        </IonToolbar>
      </IonHeader>

      <IonContent className="carte-desktop__content">
        <div className="carte-desktop__layout">
          <div className="carte-desktop__left-panel">
            <div className="carte-desktop__card-display-container">
              {/* Card navigation controls */}
              {allCards.length > 1 && (
                <div className="carte-desktop__card-navigation">
                  <div className="carte-desktop__card-nav-controls">
                    <IonButton
                      fill="clear"
                      className="carte-desktop__nav-button"
                      onClick={goToPrevCard}
                      disabled={currentCardIndex === 0}
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </IonButton>

                    <div className="carte-desktop__card-indicator">
                      <span className="carte-desktop__card-count">
                        {currentCardIndex + 1} / {allCards.length}
                      </span>
                      <div className="carte-desktop__card-dots">
                        {allCards.map((_, index) => (
                          <div
                            key={index}
                            className={`carte-desktop__card-dot ${index === currentCardIndex ? "active" : ""}`}
                            onClick={() => changeCard(index)}
                          />
                        ))}
                      </div>
                    </div>

                    <IonButton
                      fill="clear"
                      className="carte-desktop__nav-button"
                      onClick={goToNextCard}
                      disabled={currentCardIndex === allCards.length - 1}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  className="carte-desktop__card-display"
                  initial={{
                    opacity: 0,
                    x: slideDirection === "left" ? 100 : slideDirection === "right" ? -100 : 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: slideDirection === "left" ? -100 : slideDirection === "right" ? 100 : 0,
                    scale: 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <IonCard className="carte-desktop__credit-card">
                    <IonCardContent>
                      <div className="carte-desktop__card-body">
                        <IonImg src="../puce.png" className="carte-desktop__chip" />
                        <div className="typeC">{cardDetails?.TypeCarte}</div>
                        <motion.div
                          className="carte-desktop__card-number"
                          animate={{ opacity: isCardNumberVisible ? 1 : 0.5 }}
                        >
                          {isCardNumberVisible
                            ? cardDetails?.CardNumber
                            : cardDetails?.CardNumber.replace(/\d{4}(?=.)/g, "•••• ")}
                        </motion.div>
                        <div className="carte-desktop__card-holder">{cardDetails?.CardHolder}</div>
                      </div>
                      <div className="carte-desktop__card-footer">
                        <div className="carte-desktop__expiry">
                          <span>Expire à </span>
                          <span>{cardDetails?.ExpiryDate}</span>
                        </div>
                        <div className="carte-desktop__bank-logo">
                          <IonImg src="../amen_logo.png" className="carte-desktop__bank-name" />
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </motion.div>
              </AnimatePresence>

              {/* Card visibility toggle button */}
              <IonButton fill="clear" className="carte-desktop__toggle-number-button" onClick={toggleCardNumber}>
                {isCardNumberVisible ? "Masquer le numéro" : "Afficher le numéro"}
              </IonButton>
            </div>

            <div className="carte-desktop__quick-actions">
              <IonButton expand="block" color={isCardLocked ? "danger" : "success"} onClick={toggleCardLock}>
                <IonIcon slot="start" icon={lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>
              <IonButton expand="block" color="success">
                <IonIcon slot="start" icon={cardOutline} />
                Demande Carte
              </IonButton>
              <IonButton expand="block" color="success" onClick={handleDownloadStatement}>
                <IonIcon slot="start" icon={downloadOutline} />
                Télécharger le relevé
              </IonButton>
            </div>

            <IonCard className="carte-desktop__card-limits">
              <IonCardHeader>
                <IonCardTitle className="carte-desktop-card_title">Limites de la carte</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="carte-desktop__limit-item">
                  <div className="carte-desktop__limit-info">
                    <span>Dépenses mensuelles</span>
                    <span>
                      {formatCurrency(cardDetails?.monthlyExpenses?.current || 0)} /{" "}
                      {formatCurrency(cardDetails?.monthlyExpenses?.limit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={
                      cardDetails?.monthlyExpenses
                        ? cardDetails.monthlyExpenses.current / cardDetails.monthlyExpenses.limit
                        : 0
                    }
                    color="success"
                  ></IonProgressBar>
                </div>
                <div className="carte-desktop__limit-item">
                  <div className="carte-desktop__limit-info">
                    <span>Retrait DAB</span>
                    <span>
                      {formatCurrency(cardDetails?.atmWithdrawal?.current || 0)} /{" "}
                      {formatCurrency(cardDetails?.atmWithdrawal?.limit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={
                      cardDetails?.atmWithdrawal
                        ? cardDetails.atmWithdrawal.current / cardDetails.atmWithdrawal.limit
                        : 0
                    }
                    color="success"
                  ></IonProgressBar>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="carte-desktop__right-panel">
            <div className="carte-desktop__tabs">
              <IonButton
                fill={activeTab === "operations" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("operations")}
              >
                Opérations
              </IonButton>
              <IonButton
                fill={activeTab === "details" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("details")}
              >
                Détails
              </IonButton>
              
            </div>

            <div className="carte-desktop__tab-content">
              {activeTab === "operations" && (
                <div className="carte-desktop__operations-tab">
                  <div className="carte-desktop__balance-summary">
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Solde actuel</h4>
                        <h2 className="desktop-carte_balance">{formatCurrency(accountDetails?.solde || 0)}</h2>
                      </IonCardContent>
                    </IonCard>
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Transactions en attente</h4>
                        <h2 className="desktop-carte_balance">
                          {formatCurrency(cardDetails?.pendingTransactions?.amount || 0)}
                        </h2>
                        <span>{cardDetails?.pendingTransactions?.count || 0} transactions en attente</span>
                      </IonCardContent>
                    </IonCard>
                  </div>

                  <IonCard className="carte-desktop__recent-transactions">
                    <IonCardHeader>
                      <IonCardTitle className="carte-desktop-card_title">Transactions récentes</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        {transactions.map((transaction) => (
                          <IonItem key={transaction._id} className="carte-desktop__transaction-item">
                            <IonAvatar slot="start">
                              <div className="carte-desktop__transaction-icon">💳</div>
                            </IonAvatar>
                            <IonLabel>
                              <h2>{transaction.merchant}</h2>
                              <p>
                                {new Date(transaction.transactionDate).toLocaleDateString()} - {transaction.status}
                              </p>
                              {transaction.description && (
                                <p className="transaction-description">{transaction.description}</p>
                              )}
                            </IonLabel>
                            <IonChip slot="end" color={transaction.amount < 0 ? "danger" : "success"}>
                              {transaction.amount < 0 ? "-" : "+"}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </IonChip>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </div>
              )}

              {activeTab === "details" && (
                <div className="carte-desktop__details-tab">
                  <IonCard className="carte-desktop__card-details">
                    <IonCardContent>
                      <div className="carte-desktop__details-grid">
                        <div className="carte-desktop__detail-item">
                          <h4>Type de carte</h4>
                          <p className="desktop-carte_data">{cardDetails?.TypeCarte}</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Statut de la carte</h4>
                          <IonChip color={isCardLocked ? "danger" : "success"}>
                            {isCardLocked ? "Bloquée" : "Active"}
                          </IonChip>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable à partir de</h4>
                          <p className="desktop-carte_data">{cardDetails?.ExpiryDate.split("/")[1]}/23</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable jusqu'à</h4>
                          <p className="desktop-carte_data">{cardDetails?.ExpiryDate}</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>

                  <IonCard className="carte-desktop__security-features">
                    <IonCardHeader>
                      <IonCardTitle className="carte-desktop-card_title">Fonctionnalités de sécurité</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="carte-desktop__features-grid">
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={shieldOutline} />
                          <h4>3D Secure</h4>
                          <p>Sécurité renforcée pour les transactions en ligne</p>
                        </div>
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={lockClosedOutline} />
                          <h4>Blocage instantané</h4>
                          <p>Bloquez votre carte instantanément via l'application</p>
                        </div>
                        <div className="carte-desktop__feature-card">
                          <IonIcon icon={notificationsOutline} />
                          <h4>Notifications instantanées</h4>
                          <p>Alertes en temps réel pour les transactions</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CarteDesktop

