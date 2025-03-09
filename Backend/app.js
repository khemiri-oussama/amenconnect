// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
require("dotenv").config();
const cookieParser = require("cookie-parser");


// Import routes
const authRoutes = require("./routes/authRoutes");
const ipRoutes = require("./routes/ipRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const carteRoutes = require("./routes/carteRoutes");
const qrLoginRoutes = require("./routes/qrLogin"); // Import QR login routes
const paymentRoutes = require('./routes/paymentRoutes');
const virementRoutes = require('./routes/virementRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const videoConferenceRoutes = require("./routes/videoConferenceRoutes");
const adminNotificationsRoutes = require("./routes/adminNotificationsRoutes");
const adminRoutes = require('./routes/adminAuthRoutes');
// Import Passport
const passport = require("./config/passport");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8200",
  credentials: true,
}));

// Initialize Passport
app.use(passport.initialize());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/password", forgotPasswordRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/carte", carteRoutes);
app.use("/api/qr-login", qrLoginRoutes); // Mount QR login routes
app.use("/auth", authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/virements', virementRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use("/api/video-requests", videoConferenceRoutes);
app.use("/api/admin/notifications", adminNotificationsRoutes);

app.use('/api/admin', adminRoutes);


// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred." });
});

module.exports = app;
