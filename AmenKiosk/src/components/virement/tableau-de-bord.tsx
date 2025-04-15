"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { IonIcon } from "@ionic/react"
import {
  walletOutline,
  cardOutline,
  timeOutline,
  peopleOutline,
  alertCircleOutline,
  trendingUpOutline,
  trendingDownOutline,
  eyeOutline,
  callOutline,
  mailOutline,
  calendarOutline,
} from "ionicons/icons"
import { useAuth } from "../../context/AuthContext"
import './components.css'
interface Compte {
  _id: string
  numéroCompte: string
  solde: number
  type: string
  rib: string
  soldeMinimum: number
  soldeMaximum: number
}

interface Transaction {
  _id: string
  date: string
  amount: number
  description: string
  type: "credit" | "debit"
}

interface Limite {
  quotidienne: number
  mensuelle: number
}

// Update the component interface to accept profile prop
interface TableauDeBordProps {
  profile: any // Replace 'any' with your actual Profile type if available
}

const TableauDeBord: React.FC<TableauDeBordProps> = ({ profile }) => {
  const { profile: authProfile } = useAuth()
  const [comptes, setComptes] = useState<Compte[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [limites, setLimites] = useState<Limite>({ quotidienne: 5000, mensuelle: 20000 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch accounts from profile
    if (profile && profile.comptes) {
      const comptesWithExtras = profile.comptes.map((compte: any) => ({
        ...compte,
        rib: `TN59${compte.numéroCompte}`,
        soldeMinimum: 100,
        soldeMaximum: 50000,
      }))
      setComptes(comptesWithExtras)
    }

    // Fetch recent transactions
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data = await response.json()
        // Extract the transactions array from the response and get only the 5 most recent ones.
        const txs: Transaction[] = data.transactions ? data.transactions.slice(0, 5) : []
        setTransactions(txs)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [profile])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  return (
    <div className="tableau-de-bord">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Aperçu de vos comptes</h2>
        <p className="dashboard-subtitle">Consultez vos soldes, limites et transactions récentes</p>
      </div>

      {/* Accounts Section */}
      <div className="dashboard-accounts">
        {comptes.map((compte) => (
          <div key={compte._id} className="dashboard-account-card">
            <div className="dashboard-account-header">
              <div className="dashboard-account-icon">
                <IonIcon icon={compte.type.includes("Courant") ? walletOutline : cardOutline} />
              </div>
              <div className="dashboard-account-type">{compte.type}</div>
            </div>
            <div className="dashboard-account-balance">{formatCurrency(compte.solde)}</div>
            <div className="dashboard-account-details">
              <div className="dashboard-account-detail">
                <span>Numéro de compte</span>
                <span className="dashboard-account-number">{compte.numéroCompte}</span>
              </div>
              <div className="dashboard-account-detail">
                <span>RIB</span>
                <span>{compte.rib}</span>
              </div>
              <div className="dashboard-account-limits">
                <div className="dashboard-account-limit">
                  <div className="dashboard-limit-label">
                    <div className="dashboard-limit-icon min"></div>
                    <span>Solde minimum</span>
                  </div>
                  <span>{formatCurrency(compte.soldeMinimum)}</span>
                </div>
                <div className="dashboard-account-limit">
                  <div className="dashboard-limit-label">
                    <div className="dashboard-limit-icon max"></div>
                    <span>Solde maximum</span>
                  </div>
                  <span>{formatCurrency(compte.soldeMaximum)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        {/* Transactions Section */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">
              <IonIcon icon={timeOutline} />
              <h3>Transactions récentes</h3>
            </div>
            <button className="dashboard-section-action">
              <IonIcon icon={eyeOutline} />
              <span>Voir tout</span>
            </button>
          </div>

          {loading ? (
            <div className="dashboard-loading">Chargement des transactions...</div>
          ) : transactions.length > 0 ? (
            <div className="dashboard-transactions">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="dashboard-transaction">
                  <div className="dashboard-transaction-icon">
                    <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                  </div>
                  <div className="dashboard-transaction-details">
                    <div className="dashboard-transaction-description">{transaction.description}</div>
                    <div className="dashboard-transaction-date">
                      <IonIcon icon={calendarOutline} />
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`dashboard-transaction-amount ${transaction.type === "credit" ? "credit" : "debit"}`}>
                    {transaction.type === "credit" ? "+" : "-"} {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">Aucune transaction récente</div>
          )}
        </div>

        {/* Limits Section */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <div className="dashboard-section-title">
              <IonIcon icon={alertCircleOutline} />
              <h3>Limites et informations</h3>
            </div>
          </div>

          <div className="dashboard-limits">
            <div className="dashboard-limit-card">
              <div className="dashboard-limit-card-header">
                <h4>Limite quotidienne</h4>
                <div className="dashboard-limit-value">{formatCurrency(limites.quotidienne)}</div>
              </div>
              <div className="dashboard-limit-progress-container">
                <div className="dashboard-limit-progress">
                  <div className="dashboard-limit-progress-bar" style={{ width: "30%" }}></div>
                </div>
                <div className="dashboard-limit-labels">
                  <span>Utilisé: {formatCurrency(1500)}</span>
                  <span>Restant: {formatCurrency(limites.quotidienne - 1500)}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-limit-card">
              <div className="dashboard-limit-card-header">
                <h4>Limite mensuelle</h4>
                <div className="dashboard-limit-value">{formatCurrency(limites.mensuelle)}</div>
              </div>
              <div className="dashboard-limit-progress-container">
                <div className="dashboard-limit-progress">
                  <div className="dashboard-limit-progress-bar" style={{ width: "45%" }}></div>
                </div>
                <div className="dashboard-limit-labels">
                  <span>Utilisé: {formatCurrency(9000)}</span>
                  <span>Restant: {formatCurrency(limites.mensuelle - 9000)}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-support-card">
              <h4 className="dashboard-support-title">Contacter le support</h4>
              <div className="dashboard-support-contacts">
                <div className="dashboard-support-contact">
                  <IonIcon icon={callOutline} />
                  <span>+216 71 123 456</span>
                </div>
                <div className="dashboard-support-contact">
                  <IonIcon icon={mailOutline} />
                  <span>support@banque.tn</span>
                </div>
                <div className="dashboard-support-hours">
                  <span>Horaires:</span>
                  <span>Lun-Ven: 8h-17h</span>
                </div>
              </div>
              <button className="dashboard-support-button">
                <IonIcon icon={peopleOutline} />
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableauDeBord
