"use client"

import { useState, useEffect, useRef } from "react"
import { IonIcon, IonProgressBar, IonSelect, IonSelectOption, IonModal, IonButton } from "@ionic/react"
import { cloudUploadOutline, terminalOutline, copyOutline, closeCircleOutline } from "ionicons/icons"
import axios from "axios"
import { ref, onValue, remove } from "firebase/database"
import { database } from "./firebaseClient" 

import "./terminal-styles.css"

interface Totem {
  id: string
  status: "online" | "offline"
  version: string
  temperature: number
  serial: string
  apiUrl: string
  location?: string
  agency?: string
}

interface MaintenanceTabProps {
  totems: Totem[]
  setAlertMessage: (message: string) => void
  setShowAlert: (show: boolean) => void
}

const formatUptime = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "Unknown"

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`)

  return parts.join(" ")
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const MaintenanceTab = ({ totems, setAlertMessage, setShowAlert }: MaintenanceTabProps) => {
  const [selectedMaintenanceTotem, setSelectedMaintenanceTotem] = useState<string | null>(null)
  const [selectedMaintenanceAction, setSelectedMaintenanceAction] = useState<string | null>(null)
  const [maintenanceProgress, setMaintenanceProgress] = useState<number>(0)

  // Diagnostic modal states
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false)
  const [typedOutput, setTypedOutput] = useState<string>("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [loadingStatus, setLoadingStatus] = useState<string>("Initializing diagnostic tools...")
  const terminalRef = useRef<HTMLDivElement>(null)

  // Loading progress simulation
  useEffect(() => {
    if (isLoading && isDiagnosticModalOpen) {
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + Math.random() * 0.05
          if (newProgress > 0.95) {
            return 0.95
          }

          // Update loading status based on progress
          if (newProgress > 0.3 && newProgress < 0.6) {
            setLoadingStatus("Collecting system information...")
          } else if (newProgress >= 0.6 && newProgress < 0.9) {
            setLoadingStatus("Analyzing performance metrics...")
          } else if (newProgress >= 0.9) {
            setLoadingStatus("Finalizing diagnostic report...")
          }

          return newProgress
        })
      }, 200)

      return () => clearInterval(progressInterval)
    }
  }, [isLoading, isDiagnosticModalOpen])

  // Terminal typing effect
  useEffect(() => {
    if (diagnosticResult && isDiagnosticModalOpen && !isLoading) {
      const totem = totems.find((t) => t.id === selectedMaintenanceTotem)
      const formattedResult = formatDiagnosticResult(diagnosticResult, totem?.serial || "unknown")

      setTypedOutput("")
      setIsTyping(true)

      let i = 0
      const typeText = () => {
        if (i < formattedResult.length) {
          setTypedOutput((prev) => prev + formattedResult.charAt(i))
          i++
          setTimeout(typeText, Math.random() * 10 + 5) // Random typing speed for realistic effect
        } else {
          setIsTyping(false)
        }
      }

      typeText()
    }
  }, [diagnosticResult, isDiagnosticModalOpen, selectedMaintenanceTotem, totems, isLoading])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [typedOutput])

  const formatDiagnosticResult = (result: any, serial: string) => {
    const timestamp = new Date().toISOString()
    let output = `\n# DIAGNOSTIC REPORT - ${timestamp}\n`
    output += `# TOTEM SERIAL: ${result.serial_number || serial}\n\n`

    // System information section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│             SYSTEM INFO                 │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    output += `OS: ${result.os || "Unknown"} ${result.os_version || ""}\n`
    output += `Platform: ${result.platform || "Unknown"}\n`
    output += `Architecture: ${result.architecture || "Unknown"}\n`
    output += `Uptime: ${formatUptime(result.uptime_seconds)}\n\n`

    // CPU information section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│               CPU INFO                  │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    output += `CPU Cores: ${result.cpu_count || "Unknown"}\n`

    if (result.cpu_frequency) {
      output += `CPU Frequency: ${result.cpu_frequency.current || 0} MHz`
      if (result.cpu_frequency.max) {
        output += ` (Max: ${result.cpu_frequency.max} MHz)`
      }
      output += "\n"
    }

    output += `CPU Usage: ${result.cpu_usage_percent || 0}%\n`
    output += `Load Average: ${result.load_average || "N/A"}\n\n`

    // Memory information section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│             MEMORY INFO                 │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    if (result.memory) {
      output += `Total Memory: ${result.memory.total_gb || 0} GB\n`
      output += `Used Memory: ${result.memory.used_gb || 0} GB\n`
      output += `Available Memory: ${result.memory.available_gb || 0} GB\n`
      output += `Memory Usage: ${result.memory.percent || 0}%\n\n`
    }

    // Disk information section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│              DISK INFO                  │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    if (result.disk_usage) {
      Object.entries(result.disk_usage).forEach(([drive, info]: [string, any]) => {
        output += `Drive ${drive}\n`
        output += `  Total: ${info.total_gb || 0} GB\n`
        output += `  Used: ${info.used_gb || 0} GB\n`
        output += `  Free: ${info.free_gb || 0} GB\n`
        output += `  Usage: ${info.percent || 0}%\n\n`
      })
    }

    // GPU information section
    if (result.gpu_temperature) {
      output += "┌─────────────────────────────────────────┐\n"
      output += "│               GPU INFO                  │\n"
      output += "└─────────────────────────────────────────┘\n\n"

      output += `GPU Temperature: ${result.gpu_temperature || 0}°C\n\n`
    }

    // Network information section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│             NETWORK INFO                │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    if (result.network) {
      output += `Bytes Received: ${formatBytes(result.network.bytes_recv || 0)}\n`
      output += `Bytes Sent: ${formatBytes(result.network.bytes_sent || 0)}\n`
      output += `Packets Received: ${result.network.packets_recv || 0}\n`
      output += `Packets Sent: ${result.network.packets_sent || 0}\n\n`
    }

    // Health assessment section
    output += "┌─────────────────────────────────────────┐\n"
    output += "│             HEALTH STATUS               │\n"
    output += "└─────────────────────────────────────────┘\n\n"

    // Determine health status based on thresholds
    const cpuHealthy = result.cpu_usage_percent < 80
    const memoryHealthy = result.memory?.percent < 90
    const diskHealthy = Object.values(result.disk_usage || {}).every((info: any) => info.percent < 90)
    const gpuTempHealthy = !result.gpu_temperature || result.gpu_temperature < 80

    const allHealthy = cpuHealthy && memoryHealthy && diskHealthy && gpuTempHealthy
    const hasWarnings = !allHealthy && (cpuHealthy || memoryHealthy || diskHealthy || gpuTempHealthy)

    const overallStatus = allHealthy ? "HEALTHY" : hasWarnings ? "WARNING" : "CRITICAL"

    output += `Overall Status: ${overallStatus}\n\n`

    if (!cpuHealthy) {
      output += `[WARNING] High CPU usage: ${result.cpu_usage_percent}%\n`
    }

    if (!memoryHealthy) {
      output += `[WARNING] High memory usage: ${result.memory?.percent}%\n`
    }

    if (!diskHealthy) {
      Object.entries(result.disk_usage || {}).forEach(([drive, info]: [string, any]) => {
        if (info.percent >= 90) {
          output += `[WARNING] Low disk space on ${drive}: ${info.free_gb} GB free (${info.percent}% used)\n`
        }
      })
    }

    if (!gpuTempHealthy) {
      output += `[WARNING] High GPU temperature: ${result.gpu_temperature}°C\n`
    }

    if (allHealthy) {
      output += "All systems operating within normal parameters.\n"
    }

    output += "\n# END OF DIAGNOSTIC REPORT\n"
    return output
  }

  const copyToClipboard = () => {
    if (navigator.clipboard && typedOutput) {
      navigator.clipboard.writeText(typedOutput)
      setAlertMessage("Diagnostic results copied to clipboard")
      setShowAlert(true)
    }
  }

  // Handler for executing remote maintenance action including diagnostics
  const handleExecuteMaintenance = async () => {
    if (!selectedMaintenanceTotem || !selectedMaintenanceAction) {
      setAlertMessage("Please select both a Totem and an Action.")
      setShowAlert(true)
      return
    }

    // Find the selected totem from the state
    const totem = totems.find((t) => t.id === selectedMaintenanceTotem)
    if (!totem) {
      setAlertMessage("Selected Totem not found.")
      setShowAlert(true)
      return
    }

    // If the action is "diagnose", trigger the diagnostic command and subscribe to Firebase
    if (selectedMaintenanceAction === "diagnose") {
      try {
        // Open modal and show loading state
        setIsDiagnosticModalOpen(true)
        setIsLoading(true)
        setLoadingProgress(0)
        setLoadingStatus("Initializing diagnostic tools...")

        // Trigger diagnostic command via your API endpoint
        await axios.post("/api/kiosk/diagnostic", {
          totemId: totem.serial, // or use the appropriate totem identifier if different
        })

        // Set up a Firebase listener to wait for the diagnostic report at diagnostic_reports/{serial}
        const diagnosticRef = ref(database, `diagnostic_reports/${totem.serial}`)
        onValue(diagnosticRef, (snapshot) => {
          const data = snapshot.val()
          if (data && data.data) {
            // assuming the report structure is { timestamp, data: { ...diagnosticInfo } }
            // Complete the loading animation
            setLoadingProgress(1)
            setLoadingStatus("Report received!")

            // Short delay to show the completed loading state
            setTimeout(() => {
              setIsLoading(false)
              setDiagnosticResult(data.data)

              // Remove the diagnostic report after retrieval
              remove(diagnosticRef)
                .then(() => {
                  console.log("Diagnostic report removed from Firebase.")
                })
                .catch((err) => {
                  console.error("Error removing diagnostic report:", err)
                })
            }, 500)
          }
        })
      } catch (error) {
        console.error("Error running diagnostics:", error)
        setAlertMessage(`Error running diagnostics on Totem ${totem.id}`)
        setShowAlert(true)
        setIsLoading(false)
        setIsDiagnosticModalOpen(false)
      }
      return
    }

    // Handle other maintenance actions (update, restart)
    try {
      if (selectedMaintenanceAction === "restart") {
        await axios.post("/api/kiosk/restart", {
          totemId: selectedMaintenanceTotem,
        })
        setAlertMessage(`Restart command executed for Totem ${selectedMaintenanceTotem}`)
        setShowAlert(true)
        return
      } else {
        setAlertMessage(
          `Maintenance action "${selectedMaintenanceAction}" executed for Totem ${selectedMaintenanceTotem}`,
        )
        setShowAlert(true)
      }
    } catch (error) {
      console.error("Error executing maintenance action:", error)
      setAlertMessage(`Error executing maintenance action on Totem ${selectedMaintenanceTotem}`)
      setShowAlert(true)
    }
  }

  return (
    <>
      <div className="admin-maintenance-container">
        <div className="admin-form-group">
          <label className="admin-form-label">Select Totem</label>
          <div className="admin-select-wrapper">
            <IonSelect
              placeholder="Choose a totem"
              className="admin-select"
              onIonChange={(e) => setSelectedMaintenanceTotem(e.detail.value)}
            >
              {totems.map((totem) => (
                <IonSelectOption key={totem.id} value={totem.id}>
                  {totem.id}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Action</label>
          <div className="admin-select-wrapper">
            <IonSelect
              placeholder="Choose an action"
              className="admin-select"
              onIonChange={(e) => setSelectedMaintenanceAction(e.detail.value)}
            >
              <IonSelectOption value="update">Update Software</IonSelectOption>
              <IonSelectOption value="restart">Restart Totem</IonSelectOption>
              <IonSelectOption value="diagnose">Run Diagnostics</IonSelectOption>
            </IonSelect>
          </div>
        </div>

        <button className="admin-action-button" onClick={handleExecuteMaintenance}>
          <IonIcon icon={cloudUploadOutline} />
          <span>Execute Action</span>
        </button>

        {selectedMaintenanceAction === "update" && (
          <div className="admin-progress-card">
            <h3 className="admin-progress-title">Update Progress</h3>
            <div className="admin-progress-container">
              <IonProgressBar value={maintenanceProgress} className="admin-progress-bar"></IonProgressBar>
              <span className="admin-progress-value">{Math.round(maintenanceProgress * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Terminal-style Diagnostic Modal with Loading State */}
      <IonModal
        isOpen={isDiagnosticModalOpen}
        onDidDismiss={() => setIsDiagnosticModalOpen(false)}
        className="admin-modal diagnostic-modal"
      >
        <div className="admin-modal-header terminal-header">
          <div className="terminal-title">
            <IonIcon icon={terminalOutline} className="terminal-icon" />
            <h2 className="admin-modal-title">Diagnostic Terminal</h2>
          </div>
          <div className="terminal-actions">
            <button
              className="terminal-action-button"
              onClick={copyToClipboard}
              title="Copy to clipboard"
              disabled={isLoading}
            >
              <IonIcon icon={copyOutline} />
            </button>
            <button className="admin-modal-close" onClick={() => setIsDiagnosticModalOpen(false)}>
              <IonIcon icon={closeCircleOutline} />
            </button>
          </div>
        </div>

        <div className="terminal-container">
          {isLoading ? (
            <div className="diagnostic-loading-container">
              <div className="diagnostic-loading-content">
                <div className="diagnostic-loading-icon">
                  <div className="diagnostic-loading-spinner"></div>
                </div>
                <h3 className="diagnostic-loading-text">Running Diagnostics</h3>
                <div className="diagnostic-loading-bar-container">
                  <div className="diagnostic-loading-bar" style={{ width: `${loadingProgress * 100}%` }}></div>
                </div>
                <div className="diagnostic-loading-status">{loadingStatus}</div>
              </div>
            </div>
          ) : (
            <div className="terminal-window" ref={terminalRef}>
              <div className="terminal-content">
                {typedOutput.split("\n").map((line, index) => {
                  // Apply different styling based on line content
                  let lineClass = "terminal-line"

                  if (line.includes("HEALTHY")) lineClass += " terminal-success"
                  else if (line.includes("WARNING")) lineClass += " terminal-warning"
                  else if (line.includes("CRITICAL") || line.includes("FAILURE")) lineClass += " terminal-error"
                  else if (line.includes("┌─") || line.includes("└─") || line.includes("│"))
                    lineClass += " terminal-box"
                  else if (line.startsWith("#")) lineClass += " terminal-heading"

                  return (
                    <div key={index} className={lineClass}>
                      {line || " "}
                    </div>
                  )
                })}
                {isTyping && <span className="terminal-cursor">_</span>}
              </div>
            </div>
          )}
        </div>

        <div className="terminal-footer">
          <IonButton expand="block" onClick={() => setIsDiagnosticModalOpen(false)} className="terminal-close-button">
            Close Terminal
          </IonButton>
        </div>
      </IonModal>
    </>
  )
}

export default MaintenanceTab

