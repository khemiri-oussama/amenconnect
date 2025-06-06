"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { IonIcon } from "@ionic/react"
import { timeOutline, searchOutline, filterOutline, downloadOutline } from "ionicons/icons"
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

const Historique: React.FC = () => {
  const { profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Setup default date range
  useEffect(() => {
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    setDateTo(today.toISOString().split("T")[0])
    setDateFrom(threeMonthsAgo.toISOString().split("T")[0])
  }, [])

  // Load historique transactions from profile when available
  useEffect(() => {
    if (profile) {
      let allTransactions: Transaction[] = []
      profile.comptes.forEach((compte) => {
        if (compte.historique && Array.isArray(compte.historique)) {
          allTransactions = [...allTransactions, ...compte.historique]
        }
      })
      setTransactions(allTransactions)
    } else {
      setError("Veuillez vous connecter pour voir l'historique.")
    }
  }, [profile])

  // Update filters when transactions or filter criteria change
  useEffect(() => {
    let filtered = [...transactions]

    // Search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.beneficiary && tx.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase())),
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
      filtered = filtered.filter((tx) => (tx.status || "").toLowerCase() === statusFilter.toLowerCase())
    }

    // Type
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, dateFrom, dateTo, statusFilter, typeFilter])

  const formatCurrency = (amount: number) => {
    return Math.abs(amount).toFixed(3).replace(".", ",") + " DT"
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return ""
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
        return "Completed"
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
        return "virement-table__status--success"
      case "pending":
      case "scheduled":
        return "virement-table__status--pending"
      case "failed":
        return "virement-table__status--failed"
      default:
        return ""
    }
  }

  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Bénéficiaire", "Montant", "Statut", "Référence"]
    const rows = filteredTransactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.description,
      tx.beneficiary || "",
      `${tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(3)}`,
      getStatusLabel(tx.status),
      tx.reference || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `historique_virements_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="historique">
      <div className="virement-card">
        <div className="virement-card__header">
          <h3 className="virement-card__title">
            <IonIcon icon={timeOutline} />
            Historique des virements
          </h3>
          <div className="virement-card__actions">
            <button
              className="virement-form__button virement-form__button--icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IonIcon icon={filterOutline} />
              Filtres
            </button>
            <button
              className="virement-form__button virement-form__button--icon virement-form__button--secondary"
              onClick={handleExportCSV}
            >
              <IonIcon icon={downloadOutline} />
              Exporter
            </button>
          </div>
        </div>

        <div className="virement-search">
          <div className="virement-search__input-container">
            <IonIcon icon={searchOutline} className="virement-search__icon" />
            <input
              type="text"
              className="virement-search__input"
              placeholder="Rechercher par description, bénéficiaire ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showFilters && (
          <div className="virement-filters">
            <div className="virement-filters__row">
              <div className="virement-filters__group">
                <label className="virement-filters__label">Date de début</label>
                <input
                  type="date"
                  className="virement-filters__input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="virement-filters__group">
                <label className="virement-filters__label">Date de fin</label>
                <input
                  type="date"
                  className="virement-filters__input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="virement-filters__group">
                <label className="virement-filters__label">Statut</label>
                <select
                  className="virement-filters__select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="completed">Effectué</option>
                  <option value="pending">En attente</option>
                  <option value="failed">Échoué</option>
                </select>
              </div>
              <div className="virement-filters__group">
                <label className="virement-filters__label">Type</label>
                <select
                  className="virement-filters__select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="debit">Sortant</option>
                  <option value="credit">Entrant</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="virement-loading">Chargement des transactions...</div>
        ) : error ? (
          <div className="virement-error">{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="virement-empty">Aucune transaction trouvée</div>
        ) : (
          <div className="virement-table-container">
            <table className="virement-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Bénéficiaire</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Référence</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.description}</td>
                    <td>{tx.beneficiary || "N/A"}</td>
                    <td className={tx.type === "credit" ? "text-positive" : "text-negative"}>
                      {tx.type === "credit" ? "+ " : "- "}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td>
                      <span className={`virement-table__status ${getStatusClass(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td>{tx.reference || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Historique
