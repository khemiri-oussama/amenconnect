// server.js
const connectDB = require('./config/db');
const app = require('./app');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

// Create an HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const allowedOrigins = ["http://localhost:8200", "https://localhost:8200"];
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST"],
  },
});

// Initialize your socket handler with the single Socket.IO instance
const socketHandler = require('./server/socket-handler')(io);
app.locals.socketHandler = socketHandler;
app.locals.io = io;

// Global connection logging and event listeners
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Optional: Listen for a registration event if needed
  socket.on('register', (data) => {
    const { totemId } = data;
    if (totemId) {
      socket.join(totemId);
      console.log(`Socket ${socket.id} joined room ${totemId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
