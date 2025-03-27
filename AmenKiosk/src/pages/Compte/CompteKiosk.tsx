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
  arrowBack,
} from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../../AuthContext"
import NavbarKiosk from "../../../components/NavbarKiosk"
import "./CompteKiosk.css"

interface Operation {
  id: number
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
}

const CompteKiosk: React.FC = () => {
  const { profile, authLoading } = useAuth()
  const history = useHistory()

  // Use comptes from profile data; if none available, fallback to empty array.
  const accounts = profile?.comptes ?? []
  // State for operations fetched from the API.
  const [operations, setOperations] = useState<Operation[]>([])
  const [loadingOperations, setLoadingOperations] = useState<boolean>(true)
  const [errorOperations, setErrorOperations] = useState<string | null>(null)
  
  const chartData = useMemo(() => {
    const grouped = operations.reduce((acc, op) => {
      const month = new Date(op.date).toLocaleString("default", { month: "short" })
      if (!acc[month]) {
        acc[month] = { name: month, revenus: 0, depenses: 0 }
      }
      if (op.type === "credit") {
        acc[month].revenus += op.amount
      } else if (op.type === "debit") {
        acc[month].depenses += op.amount
      }
      return acc
    }, {} as { [key: string]: { name: string; revenus: number; depenses: number } })
    return Object.values(grouped)
  }, [operations])

  // Fetch operations from the API.
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await fetch("/api/historique", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch operations")
        }
        const data: Operation[] = await response.json()
        setOperations(data)
      } catch (error) {
        console.error("Error fetching operations:", error)
        setErrorOperations("Erreur lors de la récupération des opérations.")
      } finally {
        setLoadingOperations(false)
      }
    }
    fetchOperations()
  }, [])



  // Navigate to account details
  const handleAccountClick = (accountId: string) => {
    console.log(`Viewing account ${accountId}...`)
    history.push(`/Compte/${accountId}`)
  }

  const handleBack = () => {
    history.push("/")
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
            <path
              d="M0 0H645.236C723.098 0 770.28 85.9638 728.469 151.647C697.151 200.847 715.114 266.33 767.152 292.664L793.096 305.793C854.316 336.773 866.865 418.795 817.709 466.662L691.328 589.731C677.652 603.048 659.319 610.5 640.231 610.5C577.253 610.5 543.641 684.721 585.184 732.054L641.155 795.826C676.082 835.621 671.964 896.237 631.974 930.943L582.069 974.254C522.93 1025.58 568.96 1122.18 646.076 1108.59C700.297 1099.03 746.811 1147.67 734.833 1201.41L727.617 1233.79C715.109 1289.9 752.705 1344.88 809.534 1353.59L836.788 1357.76C862.867 1361.76 886.31 1375.9 902.011 1397.1L964.656 1481.7C1003.87 1534.65 970.947 1610.18 905.469 1617.5C862.212 1622.34 829.5 1658.92 829.5 1702.44V1717.72C829.5 1756.01 800.102 1787.88 761.94 1790.96L696.194 1796.27C667.843 1798.56 652.928 1831 669.644 1854.01C685.614 1876 672.771 1907.1 645.942 1911.41L597.738 1919.16C594.251 1919.72 590.726 1920 587.195 1920H462.5H200.5H0V0Z"
              fill="#47CE65"
              stroke="#47CE65"
            />
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

            <div className="compte-kiosk-section compte-kiosk-chart-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Aperçu Financier</h2>
              </div>
              <div className="compte-kiosk-chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#colorRevenus)"
                    />
                    <Area
                      type="monotone"
                      dataKey="depenses"
                      stroke="#F43F5E"
                      fillOpacity={1}
                      fill="url(#colorDepenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="compte-kiosk-section compte-kiosk-actions-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Actions Rapides</h2>
              </div>
              <div className="compte-kiosk-actions-grid">
                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={walletOutline} />
                    <span>Virement</span>
                  </div>
                </IonButton>

                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={cardOutline} />
                    <span>Recharge</span>
                  </div>
                </IonButton>

                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={repeatOutline} />
                    <span>Conversion</span>
                  </div>
                </IonButton>

                <IonButton className="compte-kiosk-action-button">
                  <div className="compte-kiosk-action-content">
                    <IonIcon icon={analyticsOutline} />
                    <span>Analyse</span>
                  </div>
                </IonButton>
              </div>
            </div>

            <div className="compte-kiosk-section compte-kiosk-operations-section">
              <div className="compte-kiosk-section-header">
                <h2 className="compte-kiosk-section-title">Opérations Récentes</h2>
                <div className="compte-kiosk-update-date">Dernière mise à jour: 21/01/2025</div>
              </div>
              <div className="compte-kiosk-operations-list">
                {operations.map((op) => (
                  <div key={op.id} className="compte-kiosk-operation-item">
                    <IonRippleEffect />
                    <div className="compte-kiosk-operation-icon">
                      <IonIcon icon={op.type === "credit" ? trendingUpOutline : trendingDownOutline} />
                    </div>
                    <div className="compte-kiosk-operation-details">
                      <div className="compte-kiosk-operation-description">{op.description}</div>
                      <div className="compte-kiosk-operation-date">{op.date}</div>
                    </div>
                    <div className={`compte-kiosk-operation-amount ${op.type}`}>
                      {op.type === "credit" ? "+" : "-"} {op.amount.toFixed(2)} TND
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CompteKiosk

