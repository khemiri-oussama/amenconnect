"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import { Activity, Cpu, HardDrive } from "lucide-react"

interface SystemLoadChartProps {
  className?: string
}

export const SystemLoadChart: React.FC<SystemLoadChartProps> = ({ className }) => {
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
          gradient.addColorStop(0, "rgba(75,192,192,0.4)")
          gradient.addColorStop(1, "rgba(75,192,192,0.1)")
          return gradient
        },
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointRadius: 5,
      },
      {
        label: "RAM Usage (%)",
        data: [] as number[],
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, "rgba(255,99,132,0.4)")
          gradient.addColorStop(1, "rgba(255,99,132,0.1)")
          return gradient
        },
        borderColor: "rgba(255,99,132,1)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointRadius: 5,
      },
    ],
  })

  // State variables for current values
  const [currentCpuUsage, setCurrentCpuUsage] = useState<number>(0)
  const [currentRamUsage, setCurrentRamUsage] = useState<number>(0)

  // Fetch system stats function (simplified for demo)
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
      return {
        time: new Date().toLocaleTimeString(),
        cpuUsage: Math.floor(Math.random() * 100),
        ramUsage: Math.floor(Math.random() * 100),
      }
    }
  }

  useEffect(() => {
    const updateChartData = async () => {
      const result = await fetchSystemStats()

      // Update the current usage state variables
      setCurrentCpuUsage(result.cpuUsage)
      setCurrentRamUsage(result.ramUsage)

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
    const interval = setInterval(updateChartData, 5000)
    return () => clearInterval(interval)
  }, [])

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
        text: "System Load Over Time (%)",
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

  // Function to determine color based on usage percentage
  const getStatusColor = (value: number) => {
    if (value < 50) return "bg-emerald-500"
    if (value < 80) return "bg-amber-500"
    return "bg-rose-500"
  }

  return (
    <div className={className}>
      {/* Sleek system stats display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-50">
                  <Cpu className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">CPU Usage</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(currentCpuUsage)} text-white`}
              >
                {currentCpuUsage < 50 ? "Normal" : currentCpuUsage < 80 ? "Moderate" : "High"}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Current Load</span>
                <span className="text-xs font-semibold text-gray-700">{currentCpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStatusColor(currentCpuUsage)}`}
                  style={{ width: `${currentCpuUsage}%`, transition: "width 1s ease-in-out" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">RAM Usage</h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(currentRamUsage)} text-white`}
              >
                {currentRamUsage < 50 ? "Normal" : currentRamUsage < 80 ? "Moderate" : "High"}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Memory Allocated</span>
                <span className="text-xs font-semibold text-gray-700">{currentRamUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStatusColor(currentRamUsage)}`}
                  style={{ width: `${currentRamUsage}%`, transition: "width 1s ease-in-out" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-5 h-[250px]">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-5 w-5 text-gray-700" />
          <h3 className="text-sm font-medium text-gray-700">System Load History</h3>
        </div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default SystemLoadChart

