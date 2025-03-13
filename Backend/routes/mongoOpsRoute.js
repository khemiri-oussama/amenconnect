// routes/mongoOpsRoute.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    // Ensure the DB connection exists
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    // Get the admin interface
    const adminDb = mongoose.connection.db.admin();

    // Fetch server status (this requires appropriate privileges)
    const serverStatus = await adminDb.serverStatus();
    const opCounters = serverStatus.opcounters || {};

    // Define read and write operations counters.
    const readOps = opCounters.query || 0;
    const writeOps =
      (opCounters.insert || 0) +
      (opCounters.update || 0) +
      (opCounters.delete || 0);

    res.json({
      time: new Date().toLocaleTimeString(),
      readOps,
      writeOps,
    });
  } catch (error) {
    console.error("Error fetching MongoDB operations:", error);
    res.status(500).json({
      time: new Date().toLocaleTimeString(),
      readOps: 0,
      writeOps: 0,
      error: error.message,
    });
  }
});

module.exports = router;
