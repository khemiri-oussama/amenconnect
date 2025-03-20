//server/socket-handler.js
const socketHandler = (io) => {
  // Store connected kiosks
  const connectedKiosks = new Map()

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("heartbeat", async (data) => {
      const { serialNumber } = data;
      if (serialNumber) {
        // Update kiosk status to online
        const kiosk = await Kiosk.findOne({ SN: serialNumber });
        if (kiosk && kiosk.status !== 'online') {
          kiosk.status = 'online';
          await kiosk.save();
          console.log(`Heartbeat received: Kiosk ${serialNumber} is online.`);
        }
      }
    });
  
    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      // Optionally, you can try to mark the kiosk offline here,
      // or implement a timeout mechanism to update status after missing heartbeats.
    });

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

