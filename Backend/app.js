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
const qrLoginRoutes = require("./routes/qrLogin");
const paymentRoutes = require("./routes/paymentRoutes");
const virementRoutes = require("./routes/virementRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const videoConferenceRoutes = require("./routes/videoConferenceRoutes");
const adminNotificationsRoutes = require("./routes/adminNotificationsRoutes");
const adminRoutes = require("./routes/adminAuthRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const historiqueRoutes = require("./routes/historiqueRoutes");
const budgetCategoryRoutes = require("./routes/budgetCategoryRoutes");

// Import the new admin list route (which is protected inside its file)
const adminListRoutes = require("./routes/adminList");

// Import passport configuration for admin authentication (registers both local and JWT strategies)
const passport = require("./config/adminPassport");

const app = express();

// Security middleware
app.use(helmet());
// Parse JSON bodies
app.use(express.json());
// Parse cookies
app.use(cookieParser());
// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8200",
    credentials: true,
  })
);

// Initialize passport
app.use(passport.initialize());

// Mount routes
app.use("/api/compte", transactionRoutes);
app.use("/api/categories", budgetCategoryRoutes);

// If you want historiqueRoutes to be accessed only by authenticated admins,
// protect them with the admin-jwt strategy:
app.use(
  "/api/historique",
  passport.authenticate("admin-jwt", { session: false }),
  historiqueRoutes
);

app.use("/api/auth", authRoutes);
app.use("/api/password", forgotPasswordRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/carte", carteRoutes);
app.use("/api/qr-login", qrLoginRoutes);
app.use("/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/virements", virementRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/video-requests", videoConferenceRoutes);
app.use("/api/admin/notifications", adminNotificationsRoutes);

// Admin-related routes are protected by admin-jwt strategy (if not already inside the route file)
app.use("/api/admin", adminRoutes);

// The new admin list route is protected in its own file using:
// router.use(passport.authenticate('admin-jwt', { session: false }));
app.use("/api/admin/list", adminListRoutes);

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred." });
});

module.exports = app;
