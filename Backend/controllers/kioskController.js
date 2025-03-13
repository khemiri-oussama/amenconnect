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

// Shutdown kiosk using child_process
exports.shutdownKiosk = (req, res) => {
  // Note: In a production environment, you should secure this endpoint
  exec("shutdown /s /t 0", (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: "Kiosk shutdown initiated." });
  });
};

// Simulated endpoint for refreshing temperature data
exports.getTemperature = (req, res) => {
  // Generate a random temperature between 30°C and 50°C for simulation
  const temperature = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
  res.json({ temperature });
};
