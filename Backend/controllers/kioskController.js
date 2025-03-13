const Kiosk = require("../models/Kiosk");
const { exec } = require("child_process");

// Retrieve all kiosks
exports.getKiosks = async (req, res) => {
  try {
    const kiosks = await Kiosk.find();
    res.json(kiosks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new kiosk record
exports.createKiosk = async (req, res) => {
  if (!req.body.toteId) {
    return res.status(400).json({ error: "toteId is required" });
  }
  try {
    // Map the frontend field "toteId" to the backend field "tote"
    const kioskData = {
      tote: req.body.toteId,  // <-- this is the fix: store incoming toteId in the "tote" field
      status: req.body.status,
      version: req.body.version,
      temperature: req.body.temperature,
      location: req.body.location,
      agencyName: req.body.agencyName,
      enabled: req.body.enabled,
    };

    const newKiosk = new Kiosk(kioskData);
    const savedKiosk = await newKiosk.save();
    res.status(201).json(savedKiosk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update kiosk details
exports.updateKiosk = async (req, res) => {
  try {
    const updatedKiosk = await Kiosk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedKiosk);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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
    // Make sure that each kiosk device joins a room with its totemId when connecting.
    io.to(totemId).emit("shutdownCommand", { message: "Shutdown your device" });

    res.json({ message: "Shutdown command sent to kiosk device and status updated to offline." });
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
