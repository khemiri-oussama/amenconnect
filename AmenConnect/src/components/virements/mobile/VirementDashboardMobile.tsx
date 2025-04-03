"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { IonIcon } from "@ionic/react"
import {
  timeOutline,
  trendingUpOutline,
  trendingDownOutline,
  calendarOutline,
  alertCircleOutline,
} from "ionicons/icons"
import { motion } from "framer-motion"
import { useAuth } from "../../../AuthContext"

interface Transaction {
  _id: string
  date: string
  amount: number
  description: string
  type: "credit" | "debit"
}

const VirementDashboardMobile: React.FC = () => {
  const { profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data = await response.json()
        setTransactions(data.slice(0, 5)) // Get only the 5 most recent transactions
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setError("Erreur lors de la récupération des transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const account = profile && profile.comptes && profile.comptes.length > 0 ? profile.comptes[0] : null

  return (
    <div className="virement-dashboard-mobile">
      {/* Limits Section */}
      <motion.div
        className="limits-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="section-header-mobile">
          <h3 className="section-title">Limites de virement</h3>
        </div>

        <div className="limit-card">
          <div className="limit-header">
            <span className="limit-label">Limite quotidienne</span>
            <span className="limit-value">5 000 TND</span>
          </div>
          <div className="limit-progress-container">
            <div className="limit-progress">
              <div className="limit-progress-bar" style={{ width: "30%" }}></div>
            </div>
            <div className="limit-details">
              <span>Utilisé: 1 500 TND</span>
              <span>Restant: 3 500 TND</span>
            </div>
          </div>
        </div>

        <div className="limit-card">
          <div className="limit-header">
            <span className="limit-label">Limite mensuelle</span>
            <span className="limit-value">20 000 TND</span>
          </div>
          <div className="limit-progress-container">
            <div className="limit-progress">
              <div className="limit-progress-bar" style={{ width: "45%" }}></div>
            </div>
            <div className="limit-details">
              <span>Utilisé: 9 000 TND</span>
              <span>Restant: 11 000 TND</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions Section */}
      <motion.div
        className="transactions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="section-header-mobile">
          <h3 className="section-title">Transactions récentes</h3>
        </div>

        {loading ? (
          <div className="loading-state">Chargement des transactions...</div>
        ) : error ? (
          <div className="error-state">
            <IonIcon icon={alertCircleOutline} className="error-icon" />
            <p>{error}</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                className="transaction-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="transaction-icon">
                  <IonIcon icon={transaction.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                </div>
                <div className="transaction-info">
                  <div className="transaction-primary">
                    <span className="transaction-description">{transaction.description}</span>
                    <span className={`transaction-amount ${transaction.type === "credit" ? "credit" : "debit"}`}>
                      {transaction.type === "credit" ? "+" : "-"} {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                  <div className="transaction-secondary">
                    <span className="transaction-date">
                      <IonIcon icon={calendarOutline} />
                      {new Date(transaction.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <IonIcon icon={timeOutline} className="empty-icon" />
            <p>Aucune transaction récente</p>
          </div>
        )}
      </motion.div>

      {/* Support Section */}
      <motion.div
        className="support-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="section-header-mobile">
          <h3 className="section-title">Support</h3>
        </div>

        <div className="support-card">
          <div className="support-contact">
            <span className="support-label">Téléphone:</span>
            <span className="support-value">+216 71 123 456</span>
          </div>
          <div className="support-contact">
            <span className="support-label">Email:</span>
            <span className="support-value">support@banque.tn</span>
          </div>
          <div className="support-hours">
            <span className="support-label">Horaires:</span>
            <span className="support-value">Lun-Ven: 8h-17h</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VirementDashboardMobile

