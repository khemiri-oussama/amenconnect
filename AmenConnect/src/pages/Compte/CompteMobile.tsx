import type React from "react"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { IonContent, IonPage, IonIcon, IonSearchbar, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react"
import { homeOutline, walletOutline, chatbubbleOutline, cardOutline, arrowForward, statsChartOutline } from "ionicons/icons"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

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

const ComptePage: React.FC = () => {
  const history = useHistory()
  const [selectedSegment, setSelectedSegment] = useState<string>("operations")

  const handleSegmentChange = (e: CustomEvent) => {
    setSelectedSegment(e.detail.value)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-horizontal">
        <div className="status-bar"></div>

        <h1 className="page-title">Mes comptes</h1>

        {/* Account Card */}
        <div className="account-card">
          <div className="account-header">
            <span>Compte Epargne</span>
            <IonIcon icon={statsChartOutline} className="stats-icon" />
          </div>
          <div className="account-details">
            <div>
              <h2 className="balance">450.000 TND</h2>
              <p className="account-number">12345678987</p>
            </div>
            <span className="expiry-date">20/01/2025</span>
          </div>
        </div>

        {/* Chart */}
        {selectedSegment === "operations" && (
          <div className="chart-container">
            <AreaChart width={340} height={150} data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#47ce65" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#47ce65" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4961" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff4961" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
              <YAxis stroke="rgba(255,255,255,0.3)" />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ff4961" fill="url(#colorExpenses)" />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#47ce65" fill="url(#colorIncome)" />
            </AreaChart>
          </div>
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
          <div className="operations-section">
            <h3>Opérations</h3>
            <p className="last-update">Dernière mise à jour: 21/01/2025</p>
            <IonSearchbar placeholder="Rechercher" className="custom-searchbar" mode="ios"></IonSearchbar>
          </div>
        )}

        {/* Account Information Section */}
        {selectedSegment === "infos" && (
          <div className="account-info-section">
            <h2>Information du compte</h2>

            <div className="info-item">
              <span className="info-label">RIB</span>
              <span className="info-value">07098050012167474684</span>
            </div>

            <div className="info-item">
              <span className="info-label">Numéro du compte</span>
              <span className="info-value">12345678321</span>
            </div>

            <div className="info-item">
              <span className="info-label">IBAN</span>
              <span className="info-value">TN5907098050012167474684</span>
            </div>

            <div className="info-item">
              <span className="info-label">Référence agence</span>
              <span className="info-value">TN5907098050012167474684</span>
            </div>

            <div className="info-item">
              <span className="info-label">Solde du compte</span>
              <span className="info-value">40.0</span>
            </div>

            <div className="info-item">
              <span className="info-label">Date de création</span>
              <span className="info-value">22/01/2025</span>
            </div>
          </div>
        )}
      </IonContent>
      <NavMobile currentPage="compte" />
    </IonPage>
  )
}

export default ComptePage

