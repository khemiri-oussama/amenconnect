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
  trendingUpOutline,
  pieChartOutline,
  walletOutline,
} from "ionicons/icons"
import { motion } from "framer-motion"
import "./CarteDesktop.css"
import Navbar from "../../../components/Navbar"
import { useAuth } from "../../../AuthContext" // Adjust the import path as needed
import { generateBankStatement } from "../../../../services/pdf-generator"

interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  type: "debit" | "credit"
  category: string
  icon: string
}

interface SpendingCategory {
  name: string
  amount: number
  color: string
  percentage: number
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
  TypeCarte: String;
}

// These mock functions simulate fetching data for transactions and spending categories
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
          date: "07 févr. 2024",
          merchant: "SNCF",
          amount: 45.0,
          type: "debit",
          category: "Transport",
          icon: "🚂",
        },
        {
          id: "5",
          date: "06 févr. 2024",
          merchant: "Netflix",
          amount: 15.99,
          type: "debit",
          category: "Divertissement",
          icon: "🎬",
        },
      ])
    }, 1000)
  })
}

const mockFetchSpendingCategories = (): Promise<SpendingCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Courses", amount: 450.7, color: "#FF6B6B", percentage: 35 },
        { name: "Restauration", amount: 289.5, color: "#4ECDC4", percentage: 25 },
        { name: "Transport", amount: 145.0, color: "#45B7D1", percentage: 20 },
        { name: "Divertissement", amount: 115.99, color: "#96CEB4", percentage: 20 },
      ])
    }, 1000)
  })
}

const CarteDesktop: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("operations")
  const [isCardLocked, setIsCardLocked] = useState(false)
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false)
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Once the profile loads, derive the card details from the first card and its associated account
  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      const cardFromProfile = profile.cartes[0]
      const account = profile.comptes.find((compte) => compte._id === cardFromProfile.comptesId)
      setCardDetails({
        cardNumber: cardFromProfile.CardNumber,
        cardHolder: cardFromProfile.CardHolder,
        expiryDate: cardFromProfile.ExpiryDate,
        cardType: cardFromProfile.TypeCarte,
        balance: account?.solde || 0,
        pendingTransactions: 0,
        monthlySpendingLimit: 5000,
        monthlySpending: 0,
        withdrawalLimit: 1000,
        withdrawalAmount: 0,
        TypeCarte : cardFromProfile.TypeCarte,
      })
    }
  }, [profile])

  // Fetch transactions and spending categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [transactionsData, spendingCategoriesData] = await Promise.all([
          mockFetchTransactions(),
          mockFetchSpendingCategories(),
        ])
        setTransactions(transactionsData)
        setSpendingCategories(spendingCategoriesData)
      } catch (err) {
        setError("Une erreur s'est produite lors du chargement des données. Veuillez réessayer.")
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const toggleCardNumber = () => {
    setIsCardNumberVisible(!isCardNumberVisible)
  }

  const toggleCardLock = () => {
    setIsCardLocked(!isCardLocked)
    // Here you would typically make an API call to lock/unlock the card
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tn-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const handleDownloadStatement = async () => {
    try {
      if (!cardDetails || !transactions.length) {
        throw new Error("Les données ne sont pas disponibles")
      }

      await generateBankStatement({
        cardDetails,
        transactions,
        // You can customize the branding and config here if needed
        branding: {
          logo: "/amen_logo.png", // Update with the correct path to your logo
        },
      })
    } catch (error) {
      console.error("Erreur lors de la génération du relevé:", error)
      // You could add a toast or alert here to notify the user
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
          {/* Pass the profile data to your Profile component */}
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
                        ? cardDetails?.cardNumber
                        : cardDetails?.cardNumber.replace(/\d{4}(?=.)/g, "•••• ")}
                    </motion.div>
                    <div className="carte-desktop__card-holder">{cardDetails?.cardHolder}</div>
                  </div>
                  <div className="carte-desktop__card-footer">
                    <div className="carte-desktop__expiry">
                      <span>Expire à </span>
                      <span>{cardDetails?.expiryDate}</span>
                    </div>
                    <div className="carte-desktop__bank-logo">
                      <IonImg src="../amen_logo.png" className="carte-desktop__bank-name" />
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </motion.div>

            <div className="carte-desktop__quick-actions">
              <IonButton expand="block" color={isCardLocked ? "danger" : "success"} onClick={toggleCardLock}>
                <IonIcon slot="start" icon={lockClosedOutline} />
                {isCardLocked ? "Débloquer la carte" : "Bloquer la carte"}
              </IonButton>
              <IonButton expand="block" color="success">
                <IonIcon slot="start" icon={shieldOutline} />
                Paramètres de sécurité
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
                      {formatCurrency(cardDetails?.monthlySpending || 0)} /{" "}
                      {formatCurrency(cardDetails?.monthlySpendingLimit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={cardDetails ? cardDetails.monthlySpending / cardDetails.monthlySpendingLimit : 0}
                    color="success"
                  ></IonProgressBar>
                </div>
                <div className="carte-desktop__limit-item">
                  <div className="carte-desktop__limit-info">
                    <span>Retrait DAB</span>
                    <span>
                      {formatCurrency(cardDetails?.withdrawalAmount || 0)} /{" "}
                      {formatCurrency(cardDetails?.withdrawalLimit || 0)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={cardDetails ? cardDetails.withdrawalAmount / cardDetails.withdrawalLimit : 0}
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
                        <h2 className="desktop-carte_balance">{formatCurrency(cardDetails?.balance || 0)}</h2>
                        <IonChip color="success">+2,4% par rapport au mois dernier</IonChip>
                      </IonCardContent>
                    </IonCard>
                    <IonCard className="carte-desktop__balance-card">
                      <IonCardContent>
                        <h4>Transactions en attente</h4>
                        <h2 className="desktop-carte_balance">
                          {formatCurrency(cardDetails?.pendingTransactions || 0)}
                        </h2>
                        <span>3 transactions en attente</span>
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
                          <IonItem key={transaction.id} className="carte-desktop__transaction-item">
                            <IonAvatar slot="start">
                              <div className="carte-desktop__transaction-icon">{transaction.icon}</div>
                            </IonAvatar>
                            <IonLabel>
                              <h2>{transaction.merchant}</h2>
                              <p>{transaction.date}</p>
                            </IonLabel>
                            <IonChip slot="end" color={transaction.type === "debit" ? "danger" : "success"}>
                              {transaction.type === "debit" ? "-" : "+"}
                              {formatCurrency(transaction.amount)}
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
                  <IonList className="carte-desktop__spending-categories">
                    {spendingCategories.map((category, index) => (
                      <IonItem key={index} className="carte-desktop__category-item">
                        <IonLabel>
                          <h2>{category.name}</h2>
                          <p>{formatCurrency(category.amount)}</p>
                        </IonLabel>
                        <IonProgressBar
                          value={category.percentage / 100}
                          color={category.color.replace("#", "")}
                        ></IonProgressBar>
                        <IonChip slot="end">{category.percentage}%</IonChip>
                      </IonItem>
                    ))}
                  </IonList>

                  <div className="carte-desktop__spending-insights">
                    <h4 className="carte-desktop-card_title">Aperçus</h4>
                    <div className="carte-desktop__insights-grid">
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={trendingUpOutline} />
                          <p>Vos dépenses pour les courses ont augmenté de 15% ce mois-ci</p>
                        </IonCardContent>
                      </IonCard>
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={pieChartOutline} />
                          <p>Vous avez atteint 80% de votre budget restauration</p>
                        </IonCardContent>
                      </IonCard>
                      <IonCard className="carte-desktop__insight-card">
                        <IonCardContent>
                          <IonIcon icon={walletOutline} />
                          <p>Économisez 200 € en réduisant les dépenses de divertissement</p>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="carte-desktop__details-tab">
                  <IonCard className="carte-desktop__card-details">
                    <IonCardContent>
                      <div className="carte-desktop__details-grid">
                        <div className="carte-desktop__detail-item">
                          <h4>Type de carte</h4>
                          <p className="desktop-carte_data">{cardDetails?.cardType}</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Statut de la carte</h4>
                          <IonChip color={isCardLocked ? "danger" : "success"}>
                            {isCardLocked ? "Bloquée" : "Active"}
                          </IonChip>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable à partir de</h4>
                          <p className="desktop-carte_data">{cardDetails?.expiryDate.split("/")[1]}/23</p>
                        </div>
                        <div className="carte-desktop__detail-item">
                          <h4>Valable jusqu'à</h4>
                          <p className="desktop-carte_data">{cardDetails?.expiryDate}</p>
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

