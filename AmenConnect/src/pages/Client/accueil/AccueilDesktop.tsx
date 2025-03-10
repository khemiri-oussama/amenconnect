"use client"
import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { IonContent, IonHeader, IonPage, IonIcon, IonRippleEffect, IonButton } from "@ionic/react"
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
  globeOutline,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Navbar from "../../../components/Navbar"
import "./AccueilDesktop.css"
import { useHistory } from "react-router-dom"
import Profile from "./MenuDesktop/ProfileMenu"
import { useAuth } from "../../../AuthContext"
import NotificationDesktop from "./NotificationMenu/NotificationDesktop"
import BudgetCategoryManager from "../../../components/BudgetCategory/BudgetCategoryManager"
import Compte from "../Compte/Compte"

interface Account {
  _id: string
  numéroCompte: string
  solde: number
  type: string
  lastMonthExpenses: number
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

interface BudgetCategory {
  userId: string
  id: string
  name: string
  limit: number
  color: string
  current: number
  _id: string
  __v: number
  createdAt: Date
  updatedAt: Date
}

const AccueilDesktop: React.FC = () => {
  const history = useHistory()
  const { profile, authLoading } = useAuth()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true)
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false)
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])

  const [prenom, setPrenom] = useState<string>("Utilisateur")
  const [nom, setNom] = useState<string>("Foulen")
  const [email, setEmail] = useState<string>("foulen@gmail.com")
  const [tel, setTel] = useState<string>("06 12 34 56 78")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [cards, setCards] = useState<Card[]>([])

  // When profile is available, derive user details and set accounts/cards.
  useEffect(() => {
    if (profile) {
      setPrenom(profile.user?.prenom || "Utilisateur")
      setNom(profile.user?.nom || "Foulen")
      setEmail(profile.user?.email || "foulen@gmail.com")
      setTel(profile.user?.telephone || "06 12 34 56 78")

      setAccounts(
        (profile.comptes || []).map((compte: any) => ({
          _id: compte._id,
          numéroCompte: compte.numéroCompte,
          solde: compte.solde,
          type: compte.type,
          // Map lastMonthExpenses from compte data, defaulting to 0 if missing.
          lastMonthExpenses: compte.lastMonthExpenses || 0,
        }))
      )

      setCards(
        (profile.cartes || []).map((card: any) => ({
          _id: card._id,
          CardNumber: card.CardNumber,
          ExpiryDate: card.ExpiryDate,
          CardHolder: card.CardHolder,
        }))
      )
    }
  }, [profile])

  if (authLoading) {
    return <div>Loading...</div>
  }

  // Fetch transactions from the API.
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
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

  // Fetch budget categories from the API once the user profile is available.
  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        const response = await fetch(`/api/categories?userId=${profile?.user._id}`)
        if (!response.ok) {
          throw new Error("Error fetching budget categories")
        }
        const data = await response.json()
        // Map _id to id for client-side usage.
        const mappedCategories: BudgetCategory[] = data.map((cat: any) => ({
          ...cat,
          id: cat._id,
        }))
        setBudgetCategories(mappedCategories)
      } catch (error) {
        console.error(error)
      }
    }
    if (profile?.user._id) {
      fetchBudgetCategories()
    }
  }, [profile])

  // Calculate total balance across all accounts.
  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.solde, 0),
    [accounts]
  )

  // Calculate total expenses of the last month from accounts.
  const totalLastMonthExpenses = useMemo(() => {
    return accounts.reduce((sum, account) => sum + account.lastMonthExpenses, 0)
  }, [accounts])

  // Group transactions by month for the chart.
  const chartData = useMemo(() => {
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date)
      const month = date.toLocaleString("default", { month: "short" })
      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expenses: 0 }
      }
      if (transaction.type === "credit") {
        acc[month].income += transaction.amount
      } else if (transaction.type === "debit") {
        acc[month].expenses += transaction.amount
      }
      return acc
    }, {} as { [month: string]: { name: string; income: number; expenses: number } })
    return Object.values(groupedData)
  }, [transactions])

  // Calculate last month's income, expenses, and savings from transactions.
  const lastMonthStats = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    let income = 0
    let expense = 0
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date)
      if (
        txDate.getMonth() === lastMonth.getMonth() &&
        txDate.getFullYear() === lastMonth.getFullYear()
      ) {
        if (tx.type === "credit") {
          income += tx.amount
        } else if (tx.type === "debit") {
          expense += tx.amount
        }
      }
    })
    return { income, expense, savings: income - expense }
  }, [transactions])

  // Calculate savings percentage relative to last month's expense.
  const savingsPercentage =
    lastMonthStats.expense > 0 ? (lastMonthStats.savings / lastMonthStats.expense) * 100 : 0

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

  const handleSaveBudgetCategories = (updatedCategories: BudgetCategory[]) => {
    setBudgetCategories(updatedCategories)
    // Here you would typically save to your backend.
    console.log("Saving updated budget categories:", updatedCategories)
  }

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
              `${totalLastMonthExpenses.toFixed(2)} TND`,
              "-1.8% depuis le mois dernier",
              pieChartOutline,
              "negative"
            )}
            {renderStatCard(
              "Économies",
              `${lastMonthStats.savings.toFixed(2)} TND`,
              `${savingsPercentage >= 0 ? '+' : ''}${savingsPercentage.toFixed(2)}% depuis le mois dernier`,
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
                <a
                  href="#"
                  className="section-link"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsBudgetModalOpen(true)
                  }}
                >
                  <IonIcon icon={eyeOutline} />
                  Voir les détails
                </a>
              </div>
              {budgetCategories.length > 0 ? (
                budgetCategories.map((category) => {
                  const percentage = (category.current / category.limit) * 100
                  return (
                    <div
                      key={category.id}
                      className="budget-item"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsBudgetModalOpen(true)
                      }}
                    >
                      <IonRippleEffect />
                      <div className="budget-item-header">
                        <div className="budget-item-label">
                          <span
                            className="budget-item-color"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span>{category.name}</span>
                        </div>
                        <span className="budget-item-amount">
                          {category.current} / {category.limit} TND
                        </span>
                      </div>
                      <div className="budget-progress">
                        <div
                          className="budget-progress-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div>Aucune donnée de budget disponible</div>
              )}
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
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={peopleOutline} />
                Virement
              </IonButton>
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={cardOutline} />
                Payer une Facture
              </IonButton>
              <IonButton expand="block" className="quick-action-button" onClick={() => history.push("/virement")}>
                <IonIcon slot="start" icon={globeOutline} />
                Transfert International
              </IonButton>
              <IonButton
                expand="block"
                className="quick-action-button"
                onClick={(e) => {
                  e.preventDefault()
                  setIsBudgetModalOpen(true)
                }}
              >
                <IonIcon slot="start" icon={pieChartOutline} />
                Gérer le Budget
              </IonButton>
            </div>
          </div>
        </div>
        <BudgetCategoryManager
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          userId={profile?.user._id || ""}
          initialCategories={budgetCategories}
          onSave={handleSaveBudgetCategories}
        />
      </IonContent>
    </IonPage>
  )
}

export default AccueilDesktop
