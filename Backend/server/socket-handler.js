//server/socket-handler.js
const socketHandler = (io) => {
    // Store connected kiosks
    const connectedKiosks = new Map()
  
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id)
  
      // Handle kiosk registration
      socket.on("registerKiosk", (data) => {
        const { serialNumber } = data
  
        if (serialNumber) {
          // Store the socket ID with the serial number
          connectedKiosks.set(serialNumber, socket.id)
  
          // Join a room with the serial number for targeted messages
          socket.join(serialNumber)
  
          console.log(`Kiosk registered: ${serialNumber} with socket ID: ${socket.id}`)
        }
      })
  
      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
  
        // Remove the disconnected kiosk from our map
        for (const [serialNumber, socketId] of connectedKiosks.entries()) {
          if (socketId === socket.id) {
            connectedKiosks.delete(serialNumber)
            console.log(`Kiosk unregistered: ${serialNumber}`)
            break
          }
        }
      })
    })
  
    // Return methods to be used by API routes
    return {
      notifyKioskApproval: (serialNumber, status, message) => {
        io.to(serialNumber).emit("kioskApprovalStatus", {
          serialNumber,
          status, // 'approved' or 'rejected'
          message,
        })
      },
    }
  }
  
  module.exports = socketHandler
  
  