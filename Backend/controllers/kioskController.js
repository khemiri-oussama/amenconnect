// controllers/kioskController.js
const Kiosk = require("../models/Kiosk");

// GET all kiosks
exports.getKiosks = async (req, res) => {
  try {
    const kiosks = await Kiosk.find();
    res.json(kiosks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET kiosk by ID
exports.getKioskById = async (req, res) => {
  try {
    const kiosk = await Kiosk.findById(req.params.id);
    if (!kiosk) return res.status(404).json({ message: "Kiosk not found" });
    res.json(kiosk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new kiosk
exports.createKiosk = async (req, res) => {
  try {
    const newKiosk = new Kiosk(req.body);
    const savedKiosk = await newKiosk.save();
    res.status(201).json(savedKiosk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE an existing kiosk
exports.updateKiosk = async (req, res) => {
  try {
    const updatedKiosk = await Kiosk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedKiosk) return res.status(404).json({ message: "Kiosk not found" });
    res.json(updatedKiosk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a kiosk
exports.deleteKiosk = async (req, res) => {
  try {
    const deletedKiosk = await Kiosk.findByIdAndDelete(req.params.id);
    if (!deletedKiosk) return res.status(404).json({ message: "Kiosk not found" });
    res.json({ message: "Kiosk deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Shutdown a kiosk
exports.shutdownKiosk = async (req, res) => {
  const { totemId } = req.body;
  if (!totemId) {
    return res.status(400).json({ error: "Totem ID is required for shutdown." });
  }

  try {
    // Find the kiosk using the provided totemId (stored in the "tote" field)
    const kiosk = await Kiosk.findOne({ tote: totemId });
    if (!kiosk) {
      return res.status(404).json({ error: "Kiosk not found." });
    }
    
    // Check if the kiosk is online before proceeding
    if (kiosk.status !== "online") {
      return res.status(400).json({ error: "Kiosk is already offline." });
    }
    
    // Update kiosk status to offline and reset temperature
    kiosk.status = "offline";
    kiosk.temperature = 0;
    await kiosk.save();

    // Get the Socket.IO instance from the app locals
    const io = req.app.locals.io;
    
    // Emit a shutdown command to the room identified by the kiosk's totemId.
    // (Make sure each kiosk joins a room named with its totemId upon connecting.)
    io.to(totemId).emit("shutdownCommand", { message: "Shutdown your device" });

    res.json({ message: "Shutdown command sent and status updated to offline." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Simulated endpoint for refreshing temperature data
exports.getTemperature = (req, res) => {
  // Generate a random temperature between 30°C and 50°C for simulation
  const temperature = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
  res.json({ temperature });
};
