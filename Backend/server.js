// server.js
const connectDB = require('./config/db');
const app = require('./app');
require('dotenv').config();
const http = require('http');
const { initSocket } = require('./server/socket');
const PORT = process.env.PORT || 3000;
const startTotemMonitor = require('./monitorTotems');
// Create an HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the initSocket function from server/socket.js
initSocket(server);
startTotemMonitor();
// Continue with your database connection and start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
