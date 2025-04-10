"use client"
import { useState, useEffect, useMemo } from "react"
import type React from "react"
import { IonIcon, IonSearchbar } from "@ionic/react"
import { motion } from "framer-motion"
import {
  timeOutline,
  calendarOutline,
  filterOutline,
  alertCircleOutline,
  trendingUpOutline,
  trendingDownOutline,
} from "ionicons/icons"
import { useAuth } from "../../../AuthContext"

interface Transaction {
  _id: string
  date: string
  amount: number
  description: string
  type: "credit" | "debit"
  status?: string
  beneficiary?: string
  reference?: string
}

const VirementHistoriqueMobile: React.FC = () => {
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)

  // Aggregate transactions from all comptes in profile
  const transactions = useMemo(() => {
    if (!profile) return []
    let allTransactions: Transaction[] = []
    profile.comptes.forEach(compte => {
      if (compte.historique && Array.isArray(compte.historique)) {
        allTransactions = allTransactions.concat(compte.historique)
      }
    })
    // Sort transactions by date descending (most recent first)
    return allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [profile])

  // Set default date range (last 3 months)
  useEffect(() => {
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)

    setDateTo(today.toISOString().split("T")[0])
    setDateFrom(threeMonthsAgo.toISOString().split("T")[0])
  }, [])

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Search term
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.beneficiary && tx.beneficiary.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tx.reference && tx.reference.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Date range
    if (dateFrom) {
      filtered = filtered.filter((tx) => new Date(tx.date) >= new Date(dateFrom))
    }
    if (dateTo) {
      const nextDay = new Date(dateTo)
      nextDay.setDate(nextDay.getDate() + 1)
      filtered = filtered.filter((tx) => new Date(tx.date) < nextDay)
    }

    // Status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (tx) => (tx.status || "").toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Type
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter)
    }

    return filtered
  }, [transactions, searchQuery, dateFrom, dateTo, statusFilter, typeFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return ""
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
        return "Effectué"
      case "pending":
      case "scheduled":
        return "En attente"
      case "failed":
        return "Échoué"
      default:
        return status
    }
  }

  const getStatusClass = (status?: string) => {
    if (!status) return ""
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
        return "status-success"
      case "pending":
      case "scheduled":
        return "status-pending"
      case "failed":
        return "status-failed"
      default:
        return ""
    }
  }

  return (
    <div className="virement-historique-mobile">
      <div className="search-container">
        <IonSearchbar
          value={searchQuery}
          onIonChange={(e) => setSearchQuery(e.detail.value || "")}
          placeholder="Rechercher..."
          className="history-search"
        />
        <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
          <IonIcon icon={filterOutline} />
          {showFilters ? "Masquer" : "Filtres"}
        </button>
      </div>

      {showFilters && (
        <motion.div
          className="filters-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-group">
            <label className="filter-label">Date de début</label>
            <input
              type="date"
              className="filter-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Date de fin</label>
            <input
              type="date"
              className="filter-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Statut</label>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tous</option>
              <option value="completed">Effectué</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Tous</option>
              <option value="debit">Sortant</option>
              <option value="credit">Entrant</option>
            </select>
          </div>
        </motion.div>
      )}

      {profile === null ? (
        <div className="error-state">
          <IonIcon icon={alertCircleOutline} className="error-icon" />
          <p>Veuillez vous connecter pour voir l'historique.</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <IonIcon icon={timeOutline} className="empty-icon" />
          <p>Aucune transaction trouvée</p>
        </div>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction._id}
              className="transaction-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
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
                  <span className={`transaction-status ${getStatusClass(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </div>
                {transaction.beneficiary && (
                  <div className="transaction-tertiary">
                    <span className="transaction-beneficiary">À: {transaction.beneficiary}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VirementHistoriqueMobile
