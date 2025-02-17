// server.js
const connectDB = require('./config/db');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
