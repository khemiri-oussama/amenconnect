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

// Import chart components and register necessary elements
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Enhanced "Charge du Système" chart (Line Chart)
const SystemLoadChart: React.FC = () => {
  const data = {
    labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
    datasets: [
      {
        label: "Charge du Système (%)",
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
        // Use a dynamic gradient fill for better visual appeal
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, "rgba(75,192,192,0.4)")
          gradient.addColorStop(1, "rgba(75,192,192,0.1)")
          return gradient
        },
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Charge du Système Over Time",
        font: { size: 16 },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
          font: { size: 12 },
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      y: {
        ticks: {
          color: "#333",
          font: { size: 12 },
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad" as const,
    },
  }

  return (
    <div style={{ height: "200px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  )
}

// Enhanced "Répartition des Rôles" chart (Pie Chart)
const RoleDistributionChart: React.FC = () => {
  const data = {
    labels: ["Administrateurs", "Modérateurs", "Utilisateurs", "Invités"],
    datasets: [
      {
        label: "Répartition des Rôles",
        data: [10, 15, 60, 15],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Répartition des Rôles",
        font: { size: 16 },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#ddd",
        borderWidth: 1,
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  }

  return (
    <div style={{ height: "200px", width: "100%" }}>
      <Pie data={data} options={options} />
    </div>
  )
}

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

  const alerts = [
    "Tentative de connexion suspecte détectée",
    "Service en panne depuis 5 minutes",
  ]

  return (
    <IonPage>
      <div className="admin-dashboard-layout">
        {/* Sidebar Component */}
        <SidebarAdmin currentPage="Dashboard" />

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Header */}
          <AdminPageHeader
            title="Tableau de Bord"
            subtitle="Bienvenue sur votre espace administrateur"
          />

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
                  {chart.title === "Charge du Système" && <SystemLoadChart />}
                  {chart.title === "Répartition des Rôles" && <RoleDistributionChart />}
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
