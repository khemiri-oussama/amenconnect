"use client"
import type React from "react"
import { useMemo } from "react"
import { IonContent, IonPage, IonIcon, IonRippleEffect, IonButton, IonToolbar, IonHeader } from "@ionic/react"
import {
  walletOutline,
  cardOutline,
  pieChartOutline,
  trendingUpOutline,
  trendingDownOutline,
  timeOutline,
  peopleOutline,
  globeOutline,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../../AuthContext"
import NavbarKiosk from "../../../components/NavbarKiosk"
import "./AccueilKiosk.css"

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

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  type: "credit" | "debit"
}

const AccueilKiosk: React.FC = () => {
  const history = useHistory()
  const { profile, authLoading } = useAuth()

  const prenom = profile?.user?.prenom || "Utilisateur"
  const nom = profile?.user?.nom || "Foulen"

  const accounts: Account[] = (profile?.comptes || []).map((compte) => ({
    _id: compte._id,
    numéroCompte: compte.numéroCompte,
    solde: compte.solde,
    type: compte.type,
  }))

  const cards: Card[] = (profile?.cartes || []).map((card) => ({
    _id: card._id,
    CardNumber: card.CardNumber,
    ExpiryDate: card.ExpiryDate,
    CardHolder: card.CardHolder,
  }))

  const recentTransactions: Transaction[] = [
    { id: 1, description: "Supermarché", amount: 85.5, date: "2025-01-20", type: "debit" },
    { id: 2, description: "Salaire", amount: 2500.0, date: "2025-01-15", type: "credit" },
    { id: 3, description: "Restaurant", amount: 45.0, date: "2025-01-18", type: "debit" },
    { id: 4, description: "Transport", amount: 30.0, date: "2025-01-17", type: "debit" },
  ]

  const totalBalance = useMemo(() => accounts.reduce((sum, account) => sum + account.solde, 0), [accounts])

  const chartData = [
    { name: "Jan", income: 4000, expenses: 2400 },
    { name: "Feb", income: 3000, expenses: 1398 },
    { name: "Mar", income: 2000, expenses: 9800 },
    { name: "Apr", income: 2780, expenses: 3908 },
    { name: "May", income: 1890, expenses: 4800 },
    { name: "Jun", income: 2390, expenses: 3800 },
  ]

  const handleAccountClick = (accountId: string) => {
    console.log(`Viewing account ${accountId}...`)
    history.push(`/Compte/${accountId}`)
  }

  if (authLoading) {
    return <div className="accueil-kiosk-loading">Chargement...</div>
  }

  return (
    <IonPage>
      <NavbarKiosk currentPage="accueil" />
      <IonContent fullscreen>
        <div className="accueil-kiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
          </svg>

          <div className="accueil-kiosk-content">

            <div className="accueil-kiosk-header">
              <div className="accueil-kiosk-welcome">
                <h1 className="accueil-kiosk-title">
                  Bienvenu, {prenom} {nom}
                </h1>
                <p className="accueil-kiosk-subtitle">Voici un aperçu de vos finances</p>
              </div>
            </div>

            <div className="accueil-kiosk-balance-card">
              <div className="accueil-kiosk-balance-icon">
                <IonIcon icon={walletOutline} />
              </div>
              <div className="accueil-kiosk-balance-details">
                <h2 className="accueil-kiosk-balance-label">Solde Total</h2>
                <div className="accueil-kiosk-balance-amount">{totalBalance.toFixed(2)} TND</div>
              </div>
            </div>

            <div className="accueil-kiosk-grid">
              <div className="accueil-kiosk-section accueil-kiosk-accounts">
                <div className="accueil-kiosk-section-header">
                  <h2 className="accueil-kiosk-section-title">
                    <IonIcon icon={walletOutline} />
                    Comptes
                  </h2>
                </div>
                <div className="accueil-kiosk-accounts-list">
                  {accounts.map((account) => (
                    <div
                      key={account._id}
                      className="accueil-kiosk-account-item"
                      onClick={() => handleAccountClick(account._id)}
                    >
                      <IonRippleEffect />
                      <div className="accueil-kiosk-account-icon">
                        <IonIcon icon={account.type === "Compte courant" ? walletOutline : trendingUpOutline} />
                      </div>
                      <div className="accueil-kiosk-account-details">
                        <div className="accueil-kiosk-account-name">{account.type}</div>
                        <div className="accueil-kiosk-account-number">{account.numéroCompte}</div>
                      </div>
                      <div className="accueil-kiosk-account-balance">{account.solde.toFixed(2)} TND</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="accueil-kiosk-section accueil-kiosk-cards">
                <div className="accueil-kiosk-section-header">
                  <h2 className="accueil-kiosk-section-title">
                    <IonIcon icon={cardOutline} />
                    Cartes
                  </h2>
                </div>
                <div className="accueil-kiosk-cards-list">
                  {cards.map((card) => (
                    <div key={card._id} className="accueil-kiosk-card-item">
                      <IonRippleEffect />
                      <div className="accueil-kiosk-card-icon">
                        <IonIcon icon={cardOutline} />
                      </div>
                      <div className="accueil-kiosk-card-details">
                        <div className="accueil-kiosk-card-number">**** **** **** {card.CardNumber.slice(-4)}</div>
                        <div className="accueil-kiosk-card-expiry">Expire: {card.ExpiryDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="accueil-kiosk-section accueil-kiosk-chart">
                <div className="accueil-kiosk-section-header">
                  <h2 className="accueil-kiosk-section-title">
                    <IonIcon icon={pieChartOutline} />
                    Aperçu Financier
                  </h2>
                </div>
                <div className="accueil-kiosk-chart-container">
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
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                      />
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

              <div className="accueil-kiosk-section accueil-kiosk-transactions">
                <div className="accueil-kiosk-section-header">
                  <h2 className="accueil-kiosk-section-title">
                    <IonIcon icon={timeOutline} />
                    Transactions Récentes
                  </h2>
                </div>
                <div className="accueil-kiosk-transactions-list">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="accueil-kiosk-transaction-item">
                      <IonRippleEffect />
                      <div className="accueil-kiosk-transaction-icon">
                        <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                      </div>
                      <div className="accueil-kiosk-transaction-details">
                        <div className="accueil-kiosk-transaction-description">{transaction.description}</div>
                        <div className="accueil-kiosk-transaction-date">{transaction.date}</div>
                      </div>
                      <div className={`accueil-kiosk-transaction-amount ${transaction.type}`}>
                        {transaction.type === "credit" ? "+" : "-"} {transaction.amount.toFixed(2)} TND
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="accueil-kiosk-actions">
              <IonButton expand="block" className="accueil-kiosk-action-button">
                <IonIcon slot="start" icon={peopleOutline} />
                Virement
              </IonButton>
              <IonButton expand="block" className="accueil-kiosk-action-button">
                <IonIcon slot="start" icon={cardOutline} />
                Payer une Facture
              </IonButton>
              <IonButton expand="block" className="accueil-kiosk-action-button">
                <IonIcon slot="start" icon={globeOutline} />
                Transfert International
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AccueilKiosk

