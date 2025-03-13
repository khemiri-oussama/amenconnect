// kioskClient.js (to be run on the kiosk device)
const io = require("socket.io-client");
const { exec } = require("child_process");

const totemId = "TM4803"; // This should be the unique ID for this kiosk device
const socket = io("http://localhost:3000");

// Register with the server once connected
socket.on("connect", () => {
  console.log("Connected to server with socket id:", socket.id);
  socket.emit("register", { totemId });
});

// Listen for the shutdown command
socket.on("shutdownCommand", (data) => {
  console.log("Received shutdown command:", data);
  if (data.message === "Shutdown your device") {
    // Execute a shutdown on the kiosk device
    // Note: The shutdown command may differ depending on the operating system.
    exec("shutdown /s /t 0", (error, stdout, stderr) => {
      if (error) {
        return console.error("Error executing shutdown:", error);
      }
      console.log("Shutdown command executed:", stdout);
    });
  }
});
