//controllers/kioskController.js
const Kiosk = require("../models/Kiosk")
const fs = require('fs');
const path = require('path');

function saveKioskFile(kiosk) {
  // Define a base directory for approved kiosks (adjust the path as needed)
  const baseDir = path.join(__dirname, '..', 'approvedKiosks');
  // Create a directory for the kiosk using its serial number
  const kioskDir = path.join(baseDir, kiosk.SN);

  if (!fs.existsSync(kioskDir)) {
    fs.mkdirSync(kioskDir, { recursive: true });
  }

  // Create or update the kiosk file (e.g., kiosk.json)
  const filePath = path.join(kioskDir, 'kiosk.json');
  fs.writeFileSync(filePath, JSON.stringify(kiosk, null, 2));
}

// GET all kiosks
exports.getKiosks = async (req, res) => {
  try {
    const kiosks = await Kiosk.find()
    res.json(kiosks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET kiosk by ID
exports.getKioskById = async (req, res) => {
  try {
    const kiosk = await Kiosk.findById(req.params.id)
    if (!kiosk) return res.status(404).json({ message: "Kiosk not found" })
    res.json(kiosk)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE a new kiosk
exports.createKiosk = async (req, res) => {
  try {
    // Check if a kiosk with the same SN already exists
    const existingKiosk = await Kiosk.findOne({ SN: req.body.SN });
    if (existingKiosk) {
      return res.status(400).json({ error: "A kiosk with this serial number already exists." });
    }

    const newKiosk = new Kiosk(req.body);
    const savedKiosk = await newKiosk.save();
    res.status(201).json(savedKiosk);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// UPDATE an existing kiosk
exports.updateKiosk = async (req, res) => {
  try {
    const updatedKiosk = await Kiosk.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedKiosk) return res.status(404).json({ message: "Kiosk not found" })
    res.json(updatedKiosk)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// DELETE a kiosk
exports.deleteKiosk = async (req, res) => {
  try {
    const deletedKiosk = await Kiosk.findByIdAndDelete(req.params.id)
    if (!deletedKiosk) return res.status(404).json({ message: "Kiosk not found" })
    res.json({ message: "Kiosk deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Shutdown a kiosk
exports.shutdownKiosk = async (req, res) => {
  const { totemId } = req.body
  if (!totemId) {
    return res.status(400).json({ error: "Totem ID is required for shutdown." })
  }

  try {
    // Find the kiosk using the provided totemId (stored in the "tote" field)
    const kiosk = await Kiosk.findOne({ tote: totemId })
    if (!kiosk) {
      return res.status(404).json({ error: "Kiosk not found." })
    }

    // Check if the kiosk is online before proceeding
    if (kiosk.status !== "online") {
      return res.status(400).json({ error: "Kiosk is already offline." })
    }

    // Update kiosk status to offline and reset temperature
    kiosk.status = "offline"
    kiosk.temperature = 0
    await kiosk.save()

    // Get the Socket.IO instance from the app locals
    const io = req.app.locals.io

    // Emit a shutdown command to the room identified by the kiosk's totemId.
    io.to(totemId).emit("shutdownCommand", { message: "Shutdown your device" })

    res.json({ message: "Shutdown command sent and status updated to offline." })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get pending kiosks (enabled = false)
exports.getPendingKiosks = async (req, res) => {
  try {
    const pendingKiosks = await Kiosk.find({ enabled: false }).sort({ createdAt: -1 })
    res.json(pendingKiosks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Approve a kiosk
exports.approveKiosk = async (req, res) => {
  const { kioskId } = req.body;

  if (!kioskId) {
    return res.status(400).json({ error: "Kiosk ID is required for approval." });
  }

  try {
    const kiosk = await Kiosk.findById(kioskId);
    if (!kiosk) {
      return res.status(404).json({ error: "Kiosk not found." });
    }

    // Mark the kiosk as approved
    kiosk.enabled = true;
    if (!kiosk.tote) {
      const count = await Kiosk.countDocuments({ tote: { $regex: /^TM/ } });
      kiosk.tote = `TM${count + 1}`;
    }

    // Save the updated kiosk (if you wish to continue using the database)
    await kiosk.save();

    // Save the kiosk data into its own file/directory
    saveKioskFile(kiosk);

    // Notify the kiosk about the approval if using Socket.IO
    const socketHandler = req.app.locals.socketHandler;
    if (socketHandler) {
      socketHandler.notifyKioskApproval(
        kiosk.SN,
        "approved",
        "Votre configuration a été approuvée. Vous pouvez maintenant utiliser le kiosk."
      );
    }

    res.json({ message: "Kiosk approved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Reject a kiosk
exports.rejectKiosk = async (req, res) => {
  const { kioskId } = req.body

  if (!kioskId) {
    return res.status(400).json({ error: "Kiosk ID is required for rejection." })
  }

  try {
    const kiosk = await Kiosk.findById(kioskId)

    if (!kiosk) {
      return res.status(404).json({ error: "Kiosk not found." })
    }

    // Get the Socket.IO handler from app locals
    const socketHandler = req.app.locals.socketHandler

    // Notify the kiosk about the rejection before deleting
    if (socketHandler) {
      socketHandler.notifyKioskApproval(
        kiosk.SN,
        "rejected",
        "Votre configuration a été rejetée. Veuillez contacter l'administrateur pour plus d'informations.",
      )
    }

    // Delete the rejected kiosk
    await Kiosk.findByIdAndDelete(kioskId)

    res.json({ message: "Kiosk rejected and removed." })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Simulated endpoint for refreshing temperature data
exports.getTemperature = (req, res) => {
  // Generate a random temperature between 30°C and 50°C for simulation
  const temperature = Math.floor(Math.random() * (50 - 30 + 1)) + 30
  res.json({ temperature })
}

