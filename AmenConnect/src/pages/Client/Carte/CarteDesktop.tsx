"use client"
import React, { useState, useEffect } from "react"
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
import { shieldOutline, notificationsOutline, lockClosedOutline, downloadOutline } from "ionicons/icons"
import { motion } from "framer-motion"
import "./CarteDesktop.css"
import Navbar from "../../../components/Navbar"
import { useAuth, type Carte, type Compte } from "../../../AuthContext"
import { generateBankStatement, type CardDetails, type Transaction } from "../../../../services/pdf-generator"
// Import the useCarte hook from your CarteContext
import { useCarte } from "../../../CarteContext"

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
  const { updateCarteStatus } = useCarte() // Destructure the update function from CarteContext

  const [activeTab, setActiveTab] = useState("operations")
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState<Carte | null>(null)
  const [accountDetails, setAccountDetails] = useState<Compte | null>(null)
  const [transactions, setTransactions] = useState<CreditCardTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cardFromProfile = profile.cartes[0]
      setCardDetails(cardFromProfile)
      setIsCardLocked(cardFromProfile.cardStatus !== "Active")
      setTransactions(cardFromProfile.creditCardTransactions || [])

      // Find the associated account
      const associatedAccount = profile.comptes.find(
        (compte) => compte._id === cardFromProfile.comptesId
      )
      setAccountDetails(associatedAccount || null)
    }
    setIsLoading(false)
  }, [profile])

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  // Updated toggleCardLock function that calls the API
  const toggleCardLock = async () => {
    if (!cardDetails) return

    // Determine the new status based on the current status
    const newStatus = cardDetails.cardStatus === "Active" ? "Bloquer" : "Active"
    try {
      // Call the API to update the card status
      await updateCarteStatus(cardDetails._id, newStatus)
      // Update local state based on the new status
      setIsCardLocked(newStatus !== "Active")
      setCardDetails((prev) =>
        prev ? { ...prev, cardStatus: newStatus } : prev
      )
    } catch (err) {
      console.error("Failed to update card status:", err)
      // Optionally, display an error notification to the user here.
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const handleDownloadStatement = async () => {
    try {
      if (!cardDetails || !transactions.length || !accountDetails) {
        throw new Error("Les données ne sont pas disponibles")
      }

      const pdfCardDetails: CardDetails = {
        cardNumber: cardDetails.CardNumber,
        cardHolder: cardDetails.CardHolder,
        expiryDate: cardDetails.ExpiryDate,
        cardType: cardDetails.TypeCarte,
        balance: accountDetails.solde,
        pendingTransactions: cardDetails.pendingTransactions?.amount || 0,
        monthlySpendingLimit: cardDetails.monthlyExpenses?.limit || 0,
        monthlySpending: cardDetails.monthlyExpenses?.current || 0,
        withdrawalLimit: cardDetails.atmWithdrawal?.limit || 0,
        withdrawalAmount: cardDetails.atmWithdrawal?.current || 0,
      }

      const pdfTransactions: Transaction[] = transactions.map((t) => ({
        id: t._id,
        date: new Date(t.transactionDate).toLocaleDateString(),
        merchant: t.merchant,
        amount: t.amount,
        type: t.amount < 0 ? "debit" : "credit",
        category: "Non catégorisé",
        icon: "💳",
        status: t.status,
        description: t.description,
      }))

      await generateBankStatement({
        cardDetails: pdfCardDetails,
        transactions: pdfTransactions,
        branding: {
          logo: "/amen_logo.png",
        },
      })
    } catch (error) {
      console.error("Erreur lors de la génération du relevé:", error)
      // Optionally add a toast or alert to notify the user.
    }
  }

  if (authLoading || isLoading) {
    return (
      <IonPage className="carte-desktop">
        <IonContent className="carte-desktop__content">
          <div className="carte-desktop__loading">
            <IonSpinner name="crescent" />
            <p>Chargement des données...</p>
          </div>
        </IonContent>
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
            <motion.div
              className="carte-desktop__card-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
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

            <div className="carte-desktop__quick-actions">
              <IonButton
                expand="block"
                color={isCardLocked ? "danger" : "success"}
                onClick={toggleCardLock}
              >
                <IonIcon slot="start" icon={lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>
              <IonButton expand="block" color="success">
                <IonIcon slot="start" icon={shieldOutline} />
                Paramètres de sécurité
              </IonButton>
              <IonButton
                expand="block"
                color="success"
                onClick={handleDownloadStatement}
              >
                <IonIcon slot="start" icon={downloadOutline} />
                Télécharger le relevé
              </IonButton>
            </div>

            <IonCard className="carte-desktop__card-limits">
              <IonCardHeader>
                <IonCardTitle className="carte-desktop-card_title">
                  Limites de la carte
                </IonCardTitle>
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
                        ? cardDetails.monthlyExpenses.current /
                          cardDetails.monthlyExpenses.limit
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
                        ? cardDetails.atmWithdrawal.current /
                          cardDetails.atmWithdrawal.limit
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
              <IonButton
                fill={activeTab === "analytics" ? "solid" : "clear"}
                color="success"
                onClick={() => setActiveTab("analytics")}
              >
                Analyses
              </IonButton>
            </div>

            <div className="carte-desktop__tab-content">
              {activeTab === "operations" && (
                <div className="carte-desktop__operations-tab">
                  <div className="carte-desktop__balance-summary">
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Solde actuel</h4>
                        <h2 className="desktop-carte_balance">
                          {formatCurrency(accountDetails?.solde || 0)}
                        </h2>
                      </IonCardContent>
                    </IonCard>
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Transactions en attente</h4>
                        <h2 className="desktop-carte_balance">
                          {formatCurrency(cardDetails?.pendingTransactions?.amount || 0)}
                        </h2>
                        <span>
                          {cardDetails?.pendingTransactions?.count || 0} transactions en attente
                        </span>
                      </IonCardContent>
                    </IonCard>
                  </div>

                  <IonCard className="carte-desktop__recent-transactions">
                    <IonCardHeader>
                      <IonCardTitle className="carte-desktop-card_title">
                        Transactions récentes
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList>
                        {transactions.map((transaction) => (
                          <IonItem
                            key={transaction._id}
                            className="carte-desktop__transaction-item"
                          >
                            <IonAvatar slot="start">
                              <div className="carte-desktop__transaction-icon">💳</div>
                            </IonAvatar>
                            <IonLabel>
                              <h2>{transaction.merchant}</h2>
                              <p>
                                {new Date(transaction.transactionDate).toLocaleDateString()} -{" "}
                                {transaction.status}
                              </p>
                              {transaction.description && (
                                <p className="transaction-description">
                                  {transaction.description}
                                </p>
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

              {activeTab === "analytics" && (
                <div className="carte-desktop__analytics-tab">
                  <h3 className="carte-desktop-card_title">Analyse des dépenses</h3>
                  <p>Les données d'analyse ne sont pas disponibles pour le moment.</p>
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
                          <p className="desktop-carte_data">
                            {cardDetails?.ExpiryDate.split("/")[1]}/23
                          </p>
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
                      <IonCardTitle className="carte-desktop-card_title">
                        Fonctionnalités de sécurité
                      </IonCardTitle>
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
