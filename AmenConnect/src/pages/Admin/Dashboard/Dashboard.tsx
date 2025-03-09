"use client"

import type React from "react"
import { IonPage, IonIcon } from "@ionic/react"
import {
  peopleOutline,
  swapHorizontalOutline,
  shieldOutline,
  trendingUpOutline,
  pieChartOutline,
  warningOutline,
} from "ionicons/icons"
import "./Dashboard.css"
import { useAdminAuth } from "../../../AdminAuthContext"
import SidebarAdmin from "../../../components/SidebarAdmin"
import AdminPageHeader from "../adminpageheader"

const Dashboard: React.FC = () => {
  const { isAuthenticated, authLoading } = useAdminAuth()

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

  const stats = [
    { title: "Utilisateurs Actifs", value: 1250, icon: peopleOutline },
    { title: "Transactions en Temps Réel", value: 356, icon: swapHorizontalOutline },
    { title: "Alertes de Sécurité", value: 5, icon: shieldOutline },
  ]

  const charts = [
    { title: "Charge du Système", icon: trendingUpOutline },
    { title: "Répartition des Rôles", icon: pieChartOutline },
  ]

  const alerts = ["Tentative de connexion suspecte détectée", "Service en panne depuis 5 minutes"]

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Dashboard" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <AdminPageHeader title="Tableau de Bord" subtitle="Bienvenue sur votre espace administrateur" />

          {/* Stats Cards */}
          <div className="admin-stats-grid">
            {stats.map((stat, index) => (
              <div className="admin-stat-card" key={index}>
                <div className="admin-stat-icon">
                  <IonIcon icon={stat.icon} />
                </div>
                <div className="admin-stat-content">
                  <h3 className="admin-stat-value">{stat.value.toLocaleString()}</h3>
                  <p className="admin-stat-title">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="admin-charts-grid">
            {charts.map((chart, index) => (
              <div className="admin-chart-card" key={index}>
                <div className="admin-card-header">
                  <IonIcon icon={chart.icon} className="admin-card-icon" />
                  <h3 className="admin-card-title">{chart.title}</h3>
                </div>
                <div className="admin-chart-placeholder">
                  <div className="admin-chart-visual"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div className="admin-alerts-card">
            <div className="admin-card-header">
              <IonIcon icon={warningOutline} className="admin-card-icon alert" />
              <h3 className="admin-card-title">Alertes Urgentes</h3>
            </div>
            <div className="admin-alerts-list">
              {alerts.map((alert, index) => (
                <div className="admin-alert-item" key={index}>
                  <div className="admin-alert-icon">
                    <IonIcon icon={warningOutline} />
                  </div>
                  <div className="admin-alert-content">
                    <p>{alert}</p>
                  </div>
                  <div className="admin-alert-badge">Urgent</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  )
}

export default Dashboard

