// routes/adminList.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); // Loads adminPassport config
const Admin = require('../models/Admin');

// Protect all endpoints with the 'admin-jwt' strategy
router.use(passport.authenticate('admin-jwt', { session: false }));

// GET /api/admin/list - Retrieve all admins
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error retrieving admins:", error);
    res.status(500).json({ message: "Error retrieving admins", error: error.message });
  }
});

// DELETE /api/admin/list/:id - Delete an admin by ID
router.delete('/:id', async (req, res) => {
  try {
    const adminId = req.params.id;

    // Optional: Prevent an admin from deleting themselves
    if (req.user._id.toString() === adminId) {
      return res.status(400).json({ message: "You cannot delete yourself." });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
});

module.exports = router;
