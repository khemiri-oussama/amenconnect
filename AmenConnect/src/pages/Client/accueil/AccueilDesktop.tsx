"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { IonContent, IonHeader, IonPage, IonIcon, IonRippleEffect, IonButton } from "@ionic/react"
import {
  walletOutline,
  cardOutline,
  pieChartOutline,
  trendingUpOutline,
  trendingDownOutline,
  eyeOutline,
  settingsOutline,
  notificationsOutline,
  timeOutline,
  peopleOutline,
  globeOutline,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Navbar from "../../../components/Navbar"
import "./AccueilDesktop.css"
import { useHistory } from "react-router-dom"
import Profile from "./MenuDesktop/ProfileMenu"
interface Account {
  id: number
  name: string
  balance: number
  type: string
}

interface Card {
  id: number
  type: string
  number: string
  expiry: string
}

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  type: "credit" | "debit"
}

const AccueilDesktop: React.FC = () => {
  const history = useHistory()
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Compte Courant", balance: 10230.45, type: "current" },
    { id: 2, name: "Compte Épargne", balance: 5000.0, type: "savings" },
  ])

  const [cards, setCards] = useState<Card[]>([
    { id: 1, type: "Visa", number: "**** **** **** 1234", expiry: "12/25" },
    { id: 2, type: "Mastercard", number: "**** **** **** 5678", expiry: "06/24" },
  ])

  const [budgetData, setBudgetData] = useState({
    food: { current: 450, max: 600 },
    transport: { current: 200, max: 300 },
    leisure: { current: 150, max: 200 },
    shopping: { current: 300, max: 400 },
    utilities: { current: 180, max: 250 },
  })

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    { id: 1, description: "Supermarché", amount: 85.5, date: "2025-01-20", type: "debit" },
    { id: 2, description: "Salaire", amount: 2500.0, date: "2025-01-15", type: "credit" },
    { id: 3, description: "Restaurant", amount: 45.0, date: "2025-01-18", type: "debit" },
    { id: 4, description: "Transport", amount: 30.0, date: "2025-01-17", type: "debit" },
  ])

  const totalBalance = useMemo(() => accounts.reduce((sum, account) => sum + account.balance, 0), [accounts])

  const chartData = [
    { name: "Jan", income: 4000, expenses: 2400 },
    { name: "Feb", income: 3000, expenses: 1398 },
    { name: "Mar", income: 2000, expenses: 9800 },
    { name: "Apr", income: 2780, expenses: 3908 },
    { name: "May", income: 1890, expenses: 4800 },
    { name: "Jun", income: 2390, expenses: 3800 },
  ]

  const handleAccountClick = (accountId: number) => {
    console.log(`Viewing account ${accountId}...`)
  }

  const renderStatCard = (
    label: string,
    value: string,
    change: string,
    icon: string,
    changeType: "positive" | "negative",
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
              <h1 className="welcome-title">Bienvenu, Foulen</h1>
              <p className="welcome-subtitle">Voici un aperçu de vos finances</p>
            </div>
            <div className="welcome-actions">
              <IonButton fill="clear" className="notification-button">
                <IonIcon slot="icon-only" icon={notificationsOutline} />
              </IonButton>
              <Profile/>
            </div>
          </div>

          <div className="stats-grid">
            {renderStatCard(
              "Solde Total",
              `${totalBalance.toFixed(2)} TND`,
              "+2.5% depuis le mois dernier",
              walletOutline,
              "positive",
            )}
            {renderStatCard(
              "Dépenses du mois",
              "3,240.80 TND",
              "-1.8% depuis le mois dernier",
              pieChartOutline,
              "negative",
            )}
            {renderStatCard("Économies", "2,180.25 TND", "+5.2% depuis le mois dernier", trendingUpOutline, "positive")}
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
                  <div key={account.id} className="account-item" onClick={() => handleAccountClick(account.id)}>
                    <IonRippleEffect />
                    <div className="account-icon">
                      <IonIcon icon={account.type === "current" ? walletOutline : trendingUpOutline} />
                    </div>
                    <div className="account-details">
                      <div className="account-name">{account.name}</div>
                      <div className="account-type">{account.type === "current" ? " Courant" : " Épargne"}</div>
                    </div>
                    <div className="account-balance">{account.balance.toFixed(2)} TND</div>
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
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
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
                <a href="../Carte" className="section-link">
                  <IonIcon icon={settingsOutline} onClick={() => history.push("/carte")} />
                  Gérer les cartes
                </a>
              </div>
              <div className="cards-list" onClick={() => history.push("/carte")}>
                {cards.map((card) => (
                  <div key={card.id} className="card-item">
                    <IonRippleEffect />
                    <div className="card-icon">
                      <IonIcon icon={cardOutline} />
                    </div>
                    <div className="card-details">
                      <div className="card-type">{card.type}</div>
                      <div className="card-number">{card.number}</div>
                      <div className="card-expiry">Expire: {card.expiry}</div>
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
                  utilities: "var(--color-utilities)",
                }
                const percentage = (data.current / data.max) * 100
                const labels = {
                  food: "Alimentation",
                  transport: "Transport",
                  leisure: "Loisirs",
                  shopping: "Shopping",
                  utilities: "Factures",
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
                          backgroundColor: colors[category as keyof typeof colors],
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
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <IonRippleEffect />
                    <div className="transaction-icon">
                      <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-description">{transaction.description}</div>
                      <div className="transaction-date">{transaction.date}</div>
                    </div>
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "credit" ? "+" : "-"} {transaction.amount.toFixed(2)} TND
                    </div>
                  </div>
                ))}
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

