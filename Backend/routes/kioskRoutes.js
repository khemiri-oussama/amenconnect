// routes/kioskRoutes.js
const express = require("express");
const router = express.Router();
const kioskController = require("../controllers/kioskController");
const passport = require("passport");
router.use(passport.authenticate('admin-jwt', { session: false }));


// Route to register a new kiosk (totem)
router.post("/register", kioskController.createKiosk);

// Create a new kiosk entry
router.post("/", kioskController.createKiosk);

// Update a kiosk record (by its ID)
router.put("/:id", kioskController.updateKiosk);

// Endpoint to shutdown the kiosk
router.post("/shutdown", kioskController.shutdownKiosk);

// Endpoint to get simulated temperature data
router.get("/temperature", kioskController.getTemperature);

router.get("/kiosk",kioskController.getKiosks)

module.exports = router;
