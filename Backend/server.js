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
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST"],
  },
});


// Make the Socket.IO instance available in the app
app.locals.io = io;

// Log when a new client connects/disconnects
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
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
