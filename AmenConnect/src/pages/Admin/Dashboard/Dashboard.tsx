"use client"

import { useState, useEffect } from "react"
import { IonPage, IonIcon } from "@ionic/react"
import {
  peopleOutline,
  swapHorizontalOutline,
  shieldOutline,
  trendingUpOutline,
  pieChartOutline,
  warningOutline,
  serverOutline,
  discOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
} from "ionicons/icons"
import "./dashboard.css"
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)

// For Role Distribution, if you have a real API endpoint, update this accordingly.
const fetchRoleDistribution = async () => {
  return {
    admins: 10,
    moderators: 15,
    users: 60,
    guests: 15,
  }
}

// New function to fetch system stats from the real API endpoint
const fetchSystemStats = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/system-stats")
    if (!response.ok) {
      throw new Error("Failed to fetch system stats")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching system stats:", error)
    // Return fallback data in case of error
    return { time: new Date().toLocaleTimeString(), cpuUsage: 0, ramUsage: 0 }
  }
}

const SystemLoadChart = () => {
  // State for chart data
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "CPU Usage (%)",
        data: [] as number[],
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, "rgba(56, 189, 248, 0.5)")
          gradient.addColorStop(1, "rgba(56, 189, 248, 0.0)")
          return gradient
        },
        borderColor: "rgba(56, 189, 248, 1)",
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(56, 189, 248, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "RAM Usage (%)",
        data: [] as number[],
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.5)")
          gradient.addColorStop(1, "rgba(168, 85, 247, 0.0)")
          return gradient
        },
        borderColor: "rgba(168, 85, 247, 1)",
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(168, 85, 247, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  })

  // State variables for current values
  const [currentCpuUsage, setCurrentCpuUsage] = useState<number>(0)
  const [currentRamUsage, setCurrentRamUsage] = useState<number>(0)
  const [cpuStatus, setCpuStatus] = useState<string>("normal")
  const [ramStatus, setRamStatus] = useState<string>("normal")

  useEffect(() => {
    const updateChartData = async () => {
      const result = await fetchSystemStats()

      // Update the current usage state variables
      setCurrentCpuUsage(result.cpuUsage)
      setCurrentRamUsage(result.ramUsage)

      // Set status based on usage thresholds
      setCpuStatus(result.cpuUsage > 80 ? "critical" : result.cpuUsage > 60 ? "warning" : "normal")
      setRamStatus(result.ramUsage > 80 ? "critical" : result.ramUsage > 60 ? "warning" : "normal")

      setChartData((prevData) => {
        const newLabels = [...prevData.labels, result.time]
        const newCpuData = [...prevData.datasets[0].data, result.cpuUsage]
        const newRamData = [...prevData.datasets[1].data, result.ramUsage]

        // Keep only the last 10 data points
        const limitedLabels = newLabels.slice(-10)
        const limitedCpuData = newCpuData.slice(-10)
        const limitedRamData = newRamData.slice(-10)

        return {
          labels: limitedLabels,
          datasets: [
            { ...prevData.datasets[0], data: limitedCpuData },
            { ...prevData.datasets[1], data: limitedRamData },
          ],
        }
      })
    }

    // Update immediately and then every 5 seconds
    updateChartData()
    const interval = setInterval(updateChartData, 1000)
    return () => clearInterval(interval)
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "500" as const },
          color: "#64748b",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems: any) => tooltipItems[0].label,
          label: (context: any) => ` ${context.dataset.label}: ${context.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          maxRotation: 0,
          maxTicksLimit: 5,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(226, 232, 240, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 8,
          stepSize: 20,
          callback: (value: any) => value + "%",
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart" as const,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 8,
      },
    },
  }

  return (
    <div className="system-load-container">
      <div className="system-metrics">
        <div className={`system-metric-card ${cpuStatus}`}>
          <div className="metric-icon">
            <IonIcon icon={serverOutline} />
          </div>
          <div className="metric-details">
            <div className="metric-header">
              <h4>CPU</h4>
              <div className="metric-status">
                {cpuStatus === "normal" && <IonIcon icon={checkmarkCircleOutline} className="status-icon normal" />}
                {cpuStatus === "warning" && <IonIcon icon={alertCircleOutline} className="status-icon warning" />}
                {cpuStatus === "critical" && <IonIcon icon={alertCircleOutline} className="status-icon critical" />}
              </div>
            </div>
            <div className="metric-value">{currentCpuUsage}%</div>
            <div className="metric-progress">
              <div className={`progress-bar ${cpuStatus}`} style={{ width: `${currentCpuUsage}%` }}></div>
            </div>
          </div>
        </div>

        <div className={`system-metric-card ${ramStatus}`}>
          <div className="metric-icon">
            <IonIcon icon={discOutline} />
          </div>
          <div className="metric-details">
            <div className="metric-header">
              <h4>RAM</h4>
              <div className="metric-status">
                {ramStatus === "normal" && <IonIcon icon={checkmarkCircleOutline} className="status-icon normal" />}
                {ramStatus === "warning" && <IonIcon icon={alertCircleOutline} className="status-icon warning" />}
                {ramStatus === "critical" && <IonIcon icon={alertCircleOutline} className="status-icon critical" />}
              </div>
            </div>
            <div className="metric-value">{currentRamUsage}%</div>
            <div className="metric-progress">
              <div className={`progress-bar ${ramStatus}`} style={{ width: `${currentRamUsage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

// Enhanced "Répartition des Rôles" chart (Pie Chart) with real-time updates
const RoleDistributionChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["Administrateurs", "Modérateurs", "Utilisateurs", "Invités"],
    datasets: [
      {
        label: "Répartition des Rôles",
        data: [10, 15, 60, 15],
        backgroundColor: [
          "rgba(244, 45, 15, 0.8)",
          "rgba(85, 247, 88, 0.8)",
          "rgba(34, 211, 238, 0.8)",
          "rgba(191, 31, 180, 0.8)",
        ],
        borderColor: [
          "rgb(0, 0, 0)",
          "rgb(0, 0, 0)",
          "rgb(0, 0, 0)",
          "rgb(0, 0, 0)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  })

  useEffect(() => {
    const updateRoleData = async () => {
      const result = await fetchRoleDistribution()
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [result.admins, result.moderators, result.users, result.guests],
          },
        ],
      }))
    }

    // Update immediately and then every 30 seconds
    updateRoleData()
    const interval = setInterval(updateRoleData, 30000)
    return () => clearInterval(interval)
  }, [])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "500" as const },
          color: "#64748b",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" as const },
        bodyFont: { size: 13 },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
      },
    },
    animation: {
      animateRotate: true,
      duration: 800,
    },
    cutout: "60%",
  }

  return (
    <div className="role-distribution-container">
      <Pie data={chartData} options={options} />
    </div>
  )
}

const Dashboard = () => {
  const { isAuthenticated, authLoading } = useAdminAuth()
  const [stats, setStats] = useState([
    { title: "Utilisateurs Actifs", value: 1250, icon: peopleOutline },
    { title: "Transactions en Temps Réel", value: 356, icon: swapHorizontalOutline },
    { title: "Alertes de Sécurité", value: 5, icon: shieldOutline },
  ])

  useEffect(() => {
    // Update stats randomly every 10 seconds to simulate real-time changes
    const updateStats = () => {
      setStats((prev) =>
        prev.map((stat) => {
          // Random fluctuation between -5% and +5%
          const fluctuation = Math.random() * 0.1 - 0.05
          const newValue = Math.round(stat.value * (1 + fluctuation))
          return { ...stat, value: newValue }
        }),
      )
    }

    const interval = setInterval(updateStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>
  }

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
            <div className="admin-chart-card system-load">
              <div className="admin-card-header">
                <IonIcon icon={trendingUpOutline} className="admin-card-icon" />
                <h3 className="admin-card-title">Charge du Système</h3>
              </div>
              <div className="admin-chart-content">
                <SystemLoadChart />
              </div>
            </div>

            <div className="admin-chart-card">
              <div className="admin-card-header">
                <IonIcon icon={pieChartOutline} className="admin-card-icon" />
                <h3 className="admin-card-title">Répartition des Rôles</h3>
              </div>
              <div className="admin-chart-content">
                <RoleDistributionChart />
              </div>
            </div>
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

