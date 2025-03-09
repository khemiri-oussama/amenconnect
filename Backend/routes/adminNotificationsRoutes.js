const express = require("express");
const router = express.Router();
const AdminNotification = require("../models/AdminNotification");

// GET all admin notifications sorted by creation date
router.get("/", async (req, res, next) => {
  try {
    const notifications = await AdminNotification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
});

module.exports = router;