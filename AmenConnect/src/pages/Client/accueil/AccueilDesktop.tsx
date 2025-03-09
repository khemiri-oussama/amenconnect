"use client"
import React, { useMemo, useState, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonRippleEffect,
  IonButton
} from "@ionic/react"
import {
  walletOutline,
  cardOutline,
  pieChartOutline,
  trendingUpOutline,
  trendingDownOutline,
  eyeOutline,
  settingsOutline,
  timeOutline,
  peopleOutline,
  globeOutline
} from "ionicons/icons"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import Navbar from "../../../components/Navbar"
import "./AccueilDesktop.css"
import { useHistory } from "react-router-dom"
import Profile from "./MenuDesktop/ProfileMenu"
import { useAuth } from "../../../AuthContext"
import NotificationDesktop from "./NotificationMenu/NotificationDesktop"

interface Account {
  _id: string
  numéroCompte: string
  solde: number
  type: string
}

interface Card {
  _id: string
  CardNumber: string
  ExpiryDate: string
  CardHolder: string
}

// Updated Transaction interface to match API response structure
interface Transaction {
  amount: number
  type: "credit" | "debit"
  category: string
  description: string
  date: string
}

const AccueilDesktop: React.FC = () => {
  const history = useHistory()
  // Use the complete profile data from AuthContext
  const { profile, authLoading } = useAuth()

  if (authLoading) {
    return <div>Loading...</div>
  }

  // Derive user details from profile data
  const prenom = profile?.user?.prenom || "Utilisateur"
  const nom = profile?.user?.nom || "Foulen"
  const email = profile?.user?.email || "foulen@gmail.com"
  const tel = profile?.user?.telephone || "06 12 34 56 78"

  // Use comptes and cartes from the profile
  const accounts: Account[] = (profile?.comptes || []).map((compte) => ({
    _id: compte._id,
    numéroCompte: compte.numéroCompte,
    solde: compte.solde,
    type: compte.type
  }))

  const cards: Card[] = (profile?.cartes || []).map((card) => ({
    _id: card._id,
    CardNumber: card.CardNumber,
    ExpiryDate: card.ExpiryDate,
    CardHolder: card.CardHolder
  }))

  // Sample data for budget remains hardcoded
  const budgetData = {
    food: { current: 450, max: 600 },
    transport: { current: 200, max: 300 },
    leisure: { current: 150, max: 200 },
    shopping: { current: 300, max: 400 },
    utilities: { current: 180, max: 250 }
  }

  // Use state to store transactions fetched from the API
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true)
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        })
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data: Transaction[] = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error)
        setErrorTransactions("Erreur lors de la récupération des transactions.")
      } finally {
        setLoadingTransactions(false)
      }
    }
    fetchTransactions()
  }, [])

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.solde, 0),
    [accounts]
  )

  const chartData = [
    { name: "Jan", income: 4000, expenses: 2400 },
    { name: "Feb", income: 3000, expenses: 1398 },
    { name: "Mar", income: 2000, expenses: 9800 },
    { name: "Apr", income: 2780, expenses: 3908 },
    { name: "May", income: 1890, expenses: 4800 },
    { name: "Jun", income: 2390, expenses: 3800 }
  ]

  const handleAccountClick = (accountId: string) => {
    console.log(`Viewing account ${accountId}...`)
    history.push(`/Compte/${accountId}`)
  }

  const renderStatCard = (
    label: string,
    value: string,
    change: string,
    icon: string,
    changeType: "positive" | "negative"
  ) => (
    <div className="stat-card">
      <div className="stat-icon">
        <IonIcon icon={icon} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${changeType}`}>
          <IonIcon icon={changeType === "positive" ? trendingUpOutline : trendingDownOutline} />
          {change}
        </div>
      </div>
    </div>
  )

  return (
    <IonPage>
      <IonHeader>
        <Navbar currentPage="accueil" />
      </IonHeader>
      <IonContent className="ion-padding custom-content">
        <div className="dashboard-container">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1 className="welcome-title">
                Bienvenu, {nom} {prenom}
              </h1>
              <p className="welcome-subtitle">Voici un aperçu de vos finances</p>
            </div>
            <div className="welcome-actions">
              <NotificationDesktop />
              <Profile />
            </div>
          </div>

          <div className="stats-grid">
            {renderStatCard(
              "Solde Total",
              `${totalBalance.toFixed(2)} TND`,
              "+2.5% depuis le mois dernier",
              walletOutline,
              "positive"
            )}
            {renderStatCard(
              "Dépenses du mois",
              "3,240.80 TND",
              "-1.8% depuis le mois dernier",
              pieChartOutline,
              "negative"
            )}
            {renderStatCard(
              "Économies",
              "2,180.25 TND",
              "+5.2% depuis le mois dernier",
              trendingUpOutline,
              "positive"
            )}
          </div>

          <div className="main-grid">
            <div className="section-card accounts-section" onClick={() => history.push("/Compte")}>
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={walletOutline} />
                  Comptes
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Voir tout
                </a>
              </div>
              <div className="accounts-list">
                {accounts.map((account) => (
                  <div key={account._id} className="account-item" onClick={() => handleAccountClick(account._id)}>
                    <IonRippleEffect />
                    <div className="account-icon">
                      <IonIcon icon={account.type === "Compte courant" ? walletOutline : trendingUpOutline} />
                    </div>
                    <div className="account-details">
                      <div className="account-name">{account.type}</div>
                    </div>
                    <div className="account-balance">{account.solde.toFixed(2)} TND</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card chart-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={pieChartOutline} />
                  Aperçu Financier
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Détails
                </a>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="income" stroke="#82ca9d" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#8884d8" fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="section-card cards-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={cardOutline} />
                  Cartes
                </h2>
                <a href="#" className="section-link" onClick={() => history.push("/carte")}>
                  <IonIcon icon={settingsOutline} />
                  Gérer les cartes
                </a>
              </div>
              <div className="cards-list" onClick={() => history.push("/carte")}>
                {cards.map((card) => (
                  <div key={card._id} className="card-item">
                    <IonRippleEffect />
                    <div className="card-icon">
                      <IonIcon icon={cardOutline} />
                    </div>
                    <div className="card-details">
                      <div className="card-type">{card.CardNumber}</div>
                      <div className="card-expiry">Expire: {card.ExpiryDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card budget-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={pieChartOutline} />
                  Budget
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Voir les détails
                </a>
              </div>
              {Object.entries(budgetData).map(([category, data]) => {
                const colors = {
                  food: "var(--color-food)",
                  transport: "var(--color-transport)",
                  leisure: "var(--color-leisure)",
                  shopping: "var(--color-shopping)",
                  utilities: "var(--color-utilities)"
                }
                const percentage = (data.current / data.max) * 100
                const labels = {
                  food: "Alimentation",
                  transport: "Transport",
                  leisure: "Loisirs",
                  shopping: "Shopping",
                  utilities: "Factures"
                }
                return (
                  <div key={category} className="budget-item">
                    <IonRippleEffect />
                    <div className="budget-item-header">
                      <div className="budget-item-label">
                        <span
                          className="budget-item-color"
                          style={{ backgroundColor: colors[category as keyof typeof colors] }}
                        ></span>
                        <span>{labels[category as keyof typeof labels]}</span>
                      </div>
                      <span className="budget-item-amount">
                        {data.current} / {data.max} TND
                      </span>
                    </div>
                    <div className="budget-progress">
                      <div
                        className={`budget-progress-bar ${category}`}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[category as keyof typeof colors]
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="section-card transactions-section">
              <div className="section-header">
                <h2 className="section-title">
                  <IonIcon icon={timeOutline} />
                  Transactions Récentes
                </h2>
                <a href="#" className="section-link">
                  <IonIcon icon={eyeOutline} />
                  Voir tout
                </a>
              </div>
              <div className="transactions-list">
                {loadingTransactions ? (
                  <div>Loading transactions...</div>
                ) : errorTransactions ? (
                  <div className="error-message">{errorTransactions}</div>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <div key={index} className="transaction-item">
                      <IonRippleEffect />
                      <div className="transaction-icon">
                        <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-description">{transaction.description}</div>
                        <div className="transaction-date">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === "credit" ? "+" : "-"} {transaction.amount.toFixed(2)} TND
                      </div>
                    </div>
                  ))
                ) : (
                  <div>Aucune transaction disponible</div>
                )}
              </div>
            </div>
          </div>

          <div className="quick-actions-section">
            <h2 className="section-title">Actions Rapides</h2>
            <div className="quick-actions-grid">
              <IonButton expand="block" className="quick-action-button">
                <IonIcon slot="start" icon={peopleOutline} />
                Virement
              </IonButton>
              <IonButton expand="block" className="quick-action-button">
                <IonIcon slot="start" icon={cardOutline} />
                Payer une Facture
              </IonButton>
              <IonButton expand="block" className="quick-action-button">
                <IonIcon slot="start" icon={globeOutline} />
                Transfert International
              </IonButton>
              <IonButton expand="block" className="quick-action-button">
                <IonIcon slot="start" icon={pieChartOutline} />
                Gérer le Budget
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AccueilDesktop
