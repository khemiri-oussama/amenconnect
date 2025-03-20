const Kiosk = require("../models/Kiosk");

const socketHandler = (io) => {
    const connectedKiosks = new Map(); // Stores kiosk data with last heartbeat timestamp

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("heartbeat", async (data) => {
            const { serialNumber, temperature } = data;
            if (!serialNumber) return;

            try {
                let kiosk = await Kiosk.findOne({ SN: serialNumber });

                if (!kiosk) {
                    kiosk = new Kiosk({ SN: serialNumber, status: "online" });
                }

                kiosk.status = "online";
                kiosk.temperature = temperature;
                kiosk.lastHeartbeat = Date.now();
                await kiosk.save();

                connectedKiosks.set(serialNumber, { socketId: socket.id, lastHeartbeat: Date.now() });

                console.log(`Heartbeat received from ${serialNumber}. Temperature: ${temperature}`);
            } catch (error) {
                console.error("Error processing heartbeat:", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    // Periodically check for kiosks that have gone offline
    setInterval(async () => {
        const now = Date.now();
        for (const [serialNumber, kioskData] of connectedKiosks.entries()) {
            if (now - kioskData.lastHeartbeat > 30000) { // 30 seconds timeout
                try {
                    const kiosk = await Kiosk.findOne({ SN: serialNumber });
                    if (kiosk && kiosk.status !== "offline") {
                        kiosk.status = "offline";
                        await kiosk.save();
                        console.log(`Kiosk ${serialNumber} marked as offline.`);
                    }
                    connectedKiosks.delete(serialNumber);
                } catch (error) {
                    console.error("Error marking kiosk offline:", error);
                }
            }
        }
    }, 5000); // Run check every 10 seconds

    return {
        notifyKioskApproval: (serialNumber, status, message) => {
            io.to(serialNumber).emit("kioskApprovalStatus", { serialNumber, status, message });
        }
    };
};

module.exports = socketHandler;
