// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Import routes
const accountCreationRoutes = require("./routes/accountCreationRoutes");
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
const adminListRoutes = require("./routes/adminList");
const adminRoutes = require("./routes/adminAuthRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const historiqueRoutes = require("./routes/historiqueRoutes");
const budgetCategoryRoutes = require("./routes/budgetCategoryRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const systemStatsRoute = require("./routes/systemStatsRoute");
const kioskRoutes = require("./routes/kioskRoutes");
const auditLogsRoutes = require("./routes/auditLogsRoutes");
const mongoOpsRoute = require("./routes/mongoOpsRoute");
const alertsRouter = require("./routes/alerts");

// Import Passport
const passport = require("./config/passport");
const adminpassport = require("./config/adminPassport");
const Twofa = require("./routes/2fa");

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8200",
    credentials: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(adminpassport.initialize());

// Mount routes
app.use("/api", accountCreationRoutes);
app.use("/api/compte", transactionRoutes);
app.use("/api/categories", budgetCategoryRoutes);
app.use(
  "/api/historique",
  passport.authenticate("jwt", { session: false }),
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
app.use(
  "/api/admin/list",
  adminpassport.authenticate("admin-jwt", { session: false }),
  adminListRoutes
);
app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/system-stats", systemStatsRoute);
app.use(
  "/api/2fa",
  adminpassport.authenticate("admin-jwt", { session: false }),
  Twofa
);
app.use("/api/mongo-ops", mongoOpsRoute);
app.use("/api/alerts", alertsRouter);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/kiosk", kioskRoutes);

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred." });
});

module.exports = app;
