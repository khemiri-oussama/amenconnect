"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { IonContent, IonPage, IonIcon, IonSearchbar, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react"
import { statsChartOutline } from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

import "./CompteMobile.css"
import NavMobile from "../../components/NavMobile"

const chartData = [
  { month: "Jan", income: 2, expenses: 1 },
  { month: "Feb", income: 4, expenses: 2 },
  { month: "Mar", income: 3, expenses: 4 },
  { month: "Apr", income: 5, expenses: 3 },
  { month: "May", income: 7, expenses: 5 },
  { month: "Jun", income: 6, expenses: 4 },
]

const CompteMobile: React.FC = () => {
  const [today, setToday] = useState<string>("")

  useEffect(() => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("fr-FR") // Format as desired
    setToday(formattedDate)
  }, [])

  const [selectedSegment, setSelectedSegment] = useState<string>("operations")

  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="scrollable-content ion-padding-horizontal">


          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mes comptes
          </motion.h1>

          {/* Account Card */}
          <motion.div
            className="account-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="account-header">
              <span>Compte Epargne</span>
              <IonIcon icon={statsChartOutline} className="stats-icon" />
            </div>
            <div className="account-details">
              <div>
                <h2 className="balance">450.0 TND</h2>
                <p className="account-number">12345678987</p>
              </div>
              <span className="expiry-date">{today}</span>
            </div>
          </motion.div>

          {/* Chart */}
          {selectedSegment === "operations" && (
            <motion.div
              className="chart-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5722" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="1"
                    stroke="#FF5722"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#4CAF50"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Segments */}
          <IonSegment mode="ios" value={selectedSegment} onIonChange={handleSegmentChange} className="custom-segment">
            <IonSegmentButton value="operations">
              <IonLabel>Opérations</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="infos">
              <IonLabel>Infos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="credits">
              <IonLabel>Crédits</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cheques">
              <IonLabel>Chèques</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {/* Operations Section */}
          {selectedSegment === "operations" && (
            <motion.div
              className="operations-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Opérations</h3>
              <p className="last-update">Dernière mise à jour: {today}</p>
            </motion.div>
          )}
          <IonSearchbar placeholder="Rechercher" className="custom-searchbar" mode="ios"></IonSearchbar>

          {/* Account Information Section */}
          {selectedSegment === "infos" && (
            <motion.div
              className="account-info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2>Information du compte</h2>

              {[
                { label: "RIB", value: "07098050012167474684" },
                { label: "Numéro du compte", value: "12345678321" },
                { label: "IBAN", value: "TN5907098050012167474684" },
                { label: "Référence agence", value: "TN5907098050012167474684" },
                { label: "Solde du compte", value: "40.0" },
                { label: "Date de création", value: "22/01/2025" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="info-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </IonContent>
      <NavMobile currentPage="compte" />
    </IonPage>
  )
}

export default CompteMobile

