import type React from "react"
import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react"
import { useState } from "react"
import "./accueilDesktop.css"

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

const AccueilDesktop: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Compte Courant", balance: 10230.45, type: "current" },
    { id: 2, name: "Compte Épargne", balance: 5000.0, type: "savings" },
  ])

  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      type: "Visa",
      number: "**** **** **** 1234",
      expiry: "12/25",
    },
  ])

  const [budgetData, setBudgetData] = useState({
    food: { current: 450, max: 600 },
    transport: { current: 200, max: 300 },
    leisure: { current: 150, max: 200 },
  })

  const handleCardClick = () => {
    // Handle card management navigation
    console.log("Navigating to card management...")
  }

  const handleAccountClick = (accountId: number) => {
    // Handle account details navigation
    console.log(`Viewing account ${accountId}...`)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ "--background": "#181818" } as any}>
          <img src="amen_logo.png" alt="Amen Bank Logo" className="navbar-logo" />
          <div className="navbar-links">
            <a href="#" className="navbar-link" onClick={handleCardClick}>
              Cartes
            </a>
            <a href="#" className="navbar-link">
              Transactions
            </a>
            <a href="#" className="navbar-link">
              Paramètres
            </a>
            <a href="#" className="navbar-link">
              Profil
            </a>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="dashboard-container">
          <div className="welcome-section">
            <h1 className="welcome-title">Bienvenu, Foulen</h1>
            <p className="welcome-subtitle">Bienvenue sur votre tableau de bord</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card hover:bg-white/20 transition-colors cursor-pointer">
              <div className="stat-label">Solde Total</div>
              <div className="stat-value">15,230.45 TND</div>
              <div className="stat-change positive">+2.5% depuis le mois dernier</div>
            </div>
            <div className="stat-card hover:bg-white/20 transition-colors cursor-pointer">
              <div className="stat-label">Dépenses du mois</div>
              <div className="stat-value">3,240.80 TND</div>
              <div className="stat-change negative">-1.8% depuis le mois dernier</div>
            </div>
            <div className="stat-card hover:bg-white/20 transition-colors cursor-pointer">
              <div className="stat-label">Économies</div>
              <div className="stat-value">2,180.25 TND</div>
              <div className="stat-change positive">+5.2% depuis le mois dernier</div>
            </div>
          </div>

          <div className="sections-grid">
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Comptes</h2>
                <a href="#" className="section-link hover:underline">
                  Voir tout
                </a>
              </div>
              <div className="accounts-list">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="account-item hover:bg-white/20 transition-colors cursor-pointer p-4 rounded-lg mb-2"
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-gray-400">{account.type}</div>
                      </div>
                      <div className="font-semibold">{account.balance.toFixed(2)} TND</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Cartes</h2>
                <a href="#" className="section-link hover:underline">
                  Gérer les cartes
                </a>
              </div>
              <div className="cards-list">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="card-item hover:bg-white/20 transition-colors cursor-pointer p-4 rounded-lg mb-2"
                  >
                    <div className="flex items-center gap-3">
                      {/* <Card className="w-8 h-8" /> */}
                      <div>
                        <div className="font-medium">{card.type}</div>
                        <div className="text-sm text-gray-400">{card.number}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="budget-section">
            <div className="section-header">
              <h2 className="section-title">Budget</h2>
              <a href="#" className="section-link hover:underline">
                Voir les détails
              </a>
            </div>

            {Object.entries(budgetData).map(([category, data], index) => {
              const colors = {
                food: "#47ce65",
                transport: "#ffcc00",
                leisure: "#346fce",
              }
              const percentage = (data.current / data.max) * 100
              const labels = {
                food: "Alimentation",
                transport: "Transport",
                leisure: "Loisirs",
              }

              return (
                <div
                  key={category}
                  className="budget-item hover:bg-white/20 transition-colors cursor-pointer rounded-lg p-2"
                >
                  <div className="budget-item-header">
                    <div className="budget-item-label">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[category as keyof typeof colors] }}
                      ></span>
                      <span>{labels[category as keyof typeof labels]}</span>
                    </div>
                    <span>
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
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AccueilDesktop

