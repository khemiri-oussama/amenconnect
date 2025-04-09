"use client"
import React, { useMemo, useState, useEffect } from "react"
import { IonContent, IonPage, IonIcon, IonRippleEffect, IonButton } from "@ionic/react"
import {
  walletOutline,
  repeatOutline,
  analyticsOutline,
  cardOutline,
  trendingUpOutline,
  trendingDownOutline,
  printOutline,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import NavbarKiosk from "../../components/NavbarKiosk"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "./CompteKiosk.css"

interface Operation {
  _id: string
  date: string
  amount: number
  description: string
  type: "credit" | "debit"
  reference: string
}

interface Account {
  _id: string
  numéroCompte: string
  solde: number
  type: string
}

const CompteKiosk: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const history = useHistory()
  const accounts = profile?.comptes ?? []
  const [operations, setOperations] = useState<Operation[]>([])
  const [loadingOperations, setLoadingOperations] = useState(true)
  const [errorOperations, setErrorOperations] = useState<string | null>(null)

  // Fetch all paginated operations
  useEffect(() => {
    const fetchAllOperations = async () => {
      try {
        let allOperations: Operation[] = []
        let page = 1
        let totalPages = 1

        do {
          const response = await fetch(`/api/historique?page=${page}`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          })

          if (!response.ok) throw new Error("Failed to fetch operations")

          const responseData = await response.json()
          const operations = responseData.transactions || []
          
          allOperations = [...allOperations, ...operations]
          totalPages = Math.ceil(responseData.total / responseData.limit)
          page++
        } while (page <= totalPages)

        // Sort by date descending
        const sortedOperations = allOperations.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        
        setOperations(sortedOperations)
      } catch (error) {
        console.error("Error fetching operations:", error)
        setErrorOperations("Erreur lors de la récupération des opérations.")
      } finally {
        setLoadingOperations(false)
      }
    }

    fetchAllOperations()
  }, [])

  // Chart data grouped by month-year
  const chartData = useMemo(() => {
    const grouped = operations.reduce((acc, op) => {
      const date = new Date(op.date)
      const month = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const key = `${month}-${year}`

      if (!acc[key]) {
        acc[key] = { 
          name: `${month} ${year}`,
          revenus: 0,
          depenses: 0 
        }
      }

      if (op.type === "credit") {
        acc[key].revenus += op.amount
      } else {
        acc[key].depenses += op.amount
      }

      return acc
    }, {} as Record<string, { name: string; revenus: number; depenses: number }>)

    return Object.values(grouped).sort((a, b) => {
      const [aMonth, aYear] = a.name.split(" ")
      const [bMonth, bYear] = b.name.split(" ")
      return new Date(`${aMonth} 1 ${aYear}`).getTime() - new Date(`${bMonth} 1 ${bYear}`).getTime()
    })
  }, [operations])

  const handleAccountClick = (accountId: string) => {
    history.push(`/Compte/${accountId}`)
  }

  const generateBankStatement = async () => {
    const account = accounts[0] || {
      _id: "N/A",
      numéroCompte: "N/A",
      solde: 0,
      type: "Compte courant"
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.text("Relevé Bancaire", 105, 20, { align: "center" })

    // Account Information
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text(`Titulaire: ${profile?.user.prenom} ${profile?.user.nom}`, 20, 40)
    doc.text(`Compte: ${account.numéroCompte}`, 20, 48)
    doc.text(`Solde: ${account.solde.toFixed(2)} TND`, 20, 56)

    // Transactions Table
    autoTable(doc, {
      head: [["Date", "Description", "Type", "Montant", "Référence"]],
      body: operations.map(op => [
        new Date(op.date).toLocaleDateString(),
        op.description,
        op.type === "credit" ? "Crédit" : "Débit",
        `${op.amount.toFixed(2)} TND`,
        op.reference
      ]),
      startY: 65,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12
      },
      styles: { fontSize: 10 }
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i}/${pageCount}`,
        190,
        doc.internal.pageSize.getHeight() - 10,
        { align: "right" }
      )
    }

    doc.save(`releve_${account.numéroCompte}.pdf`)
  }

  if (authLoading) {
    return <div className="compte-kiosk-loading">Chargement...</div>
  }

  return (
    <IonPage>
      <NavbarKiosk currentPage="compte" />
      <IonContent fullscreen>
        <div className="compte-kiosk-container">
          <div className="background-white"></div>
          <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 983 1920" fill="none">
            {/* SVG path remains same */}
          </svg>

          <div className="compte-kiosk-content">
            <div className="compte-kiosk-header">
              <h1 className="compte-kiosk-title">Mes Comptes</h1>
              <p className="compte-kiosk-subtitle">Gérez vos comptes et suivez vos finances</p>
            </div>

            <div className="compte-kiosk-accounts-list">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className="compte-kiosk-account-card"
                  onClick={() => handleAccountClick(account._id)}
                >
                  <IonRippleEffect />
                  <div className="compte-kiosk-account-icon">
                    <IonIcon icon={account.type === "Compte courant" ? walletOutline : trendingUpOutline} />
                  </div>
                  <div className="compte-kiosk-account-details">
                    <div className="compte-kiosk-account-type">{account.type}</div>
                    <div className="compte-kiosk-account-number">{account.numéroCompte}</div>
                  </div>
                  <div className="compte-kiosk-account-balance">{account.solde.toFixed(2)} TND</div>
                </div>
              ))}
            </div>

            <div className="compte-kiosk-section compte-kiosk-statement-section">
              <IonButton onClick={generateBankStatement}>
                <IonIcon icon={printOutline} slot="start" />
                Générer le relevé
              </IonButton>
            </div>

            <div className="compte-kiosk-section compte-kiosk-chart-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Activité Financière</h2>
              </div>
              <div className="compte-kiosk-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="#4CAF50"
                      fill="url(#colorRevenus)"
                    />
                    <Area
                      type="monotone"
                      dataKey="depenses"
                      stroke="#F44336"
                      fill="url(#colorDepenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="compte-kiosk-section compte-kiosk-operations-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Historique des Opérations</h2>
                <div className="compte-kiosk-update-date">
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="compte-kiosk-operations-list">
                {loadingOperations ? (
                  <div className="loading-message">Chargement des opérations...</div>
                ) : errorOperations ? (
                  <div className="error-message">{errorOperations}</div>
                ) : operations.length > 0 ? (
                  operations.map((op) => (
                    <div key={op._id} className="compte-kiosk-operation-item">
                      <IonRippleEffect />
                      <div className="compte-kiosk-operation-icon">
                        <IonIcon icon={op.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                      </div>
                      <div className="compte-kiosk-operation-details">
                        <div className="compte-kiosk-operation-description">{op.description}</div>
                        <div className="compte-kiosk-operation-date">
                          {new Date(op.date).toLocaleDateString()}
                        </div>
                        <div className="compte-kiosk-operation-reference">
                          Référence: {op.reference}
                        </div>
                      </div>
                      <div className={`compte-kiosk-operation-amount ${op.type}`}>
                        {op.type === "credit" ? "+" : "-"} {op.amount.toFixed(2)} TND
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-operations">Aucune opération disponible</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CompteKiosk