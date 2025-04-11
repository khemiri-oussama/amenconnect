// server/socket.js
const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:8200", "https://localhost:8200"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Optionally, listen for custom events from the client
    socket.on("register", (data) => {
        if (data && data.room) {
          socket.join(data.room);
          console.log(`Socket ${socket.id} joined room ${data.room}`);
        }
      });      

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
