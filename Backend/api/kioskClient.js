// kioskClient.js (to be run on the kiosk device)
const io = require("socket.io-client")
const { exec } = require("child_process")

// Get the device's serial number from localStorage
const serialNumber = localStorage.getItem("pcUuid")
const socket = io("http://localhost:3000")

// Register with the server once connected
socket.on("connect", () => {
  console.log("Connected to server with socket id:", socket.id)

  // Check if we have a serial number
  if (serialNumber) {
    // Register with the server using the serial number
    socket.emit("register", { serialNumber })

    // Check if the kiosk is approved
    checkApprovalStatus()
  } else {
    // Redirect to setup page if no serial number is found
    window.location.href = "/setup"
  }
})

// Function to check if the kiosk is approved
async function checkApprovalStatus() {
  try {
    const response = await fetch(`/api/kiosk/check-approval?sn=${serialNumber}`)
    const data = await response.json()

    if (response.ok) {
      if (data.enabled) {
        // Kiosk is approved, update status to online
        await fetch("/api/kiosk/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serialNumber,
            status: "online",
          }),
        })

        // Redirect to the main kiosk interface
        window.location.href = "/kiosk"
      } else {
        // Kiosk is not approved, show waiting screen
        window.location.href = "/waiting"
      }
    } else {
      console.error("Error checking approval status:", data.error)
    }
  } catch (error) {
    console.error("Error checking approval status:", error)
  }
}

// Listen for the shutdown command
socket.on("shutdownCommand", (data) => {
  console.log("Received shutdown command:", data)
  if (data.message === "Shutdown your device") {
    // Execute a shutdown on the kiosk device
    // Note: The shutdown command may differ depending on the operating system.
    exec("shutdown /s /t 0", (error, stdout, stderr) => {
      if (error) {
        return console.error("Error executing shutdown:", error)
      }
      console.log("Shutdown command executed:", stdout)
    })
  }
})

// Handle reconnection
socket.on("reconnect", () => {
  console.log("Reconnected to server")
  if (serialNumber) {
    socket.emit("register", { serialNumber })
  }
})

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server")
})

