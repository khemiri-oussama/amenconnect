//controllers/kioskController.js
const Kiosk = require("../models/Kiosk")
const logger = require('../config/logger');

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
    logger.warn('Approve kiosk failed: kioskId not provided');
    return res.status(400).json({ error: "Kiosk ID is required for approval." });
  }

  try {
    const kiosk = await Kiosk.findById(kioskId);
    if (!kiosk) {
      logger.warn('Approve kiosk failed: kiosk not found', { kioskId });
      return res.status(404).json({ error: "Kiosk not found." });
    }

    // Mark the kiosk as approved
    kiosk.enabled = true;
    if (!kiosk.tote) {
      const count = await Kiosk.countDocuments({ tote: { $regex: /^TM/ } });
      kiosk.tote = `TM${count + 1}`;
    }

    await kiosk.save();
    logger.info('Kiosk approved successfully', { kioskId: kiosk._id, tote: kiosk.tote });

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
    logger.error('Approve kiosk error', { error: error.message, kioskId });
    res.status(500).json({ error: error.message });
  }
};




// Reject a kiosk
exports.rejectKiosk = async (req, res) => {
  const { kioskId } = req.body;

  if (!kioskId) {
    logger.warn('Reject kiosk failed: kioskId not provided');
    return res.status(400).json({ error: "Kiosk ID is required for rejection." });
  }

  try {
    const kiosk = await Kiosk.findById(kioskId);
    if (!kiosk) {
      logger.warn('Reject kiosk failed: kiosk not found', { kioskId });
      return res.status(404).json({ error: "Kiosk not found." });
    }

    // Get the Socket.IO handler from app locals
    const socketHandler = req.app.locals.socketHandler;
    if (socketHandler) {
      socketHandler.notifyKioskApproval(
        kiosk.SN,
        "rejected",
        "Votre configuration a été rejetée. Veuillez contacter l'administrateur pour plus d'informations."
      );
    }

    // Delete the rejected kiosk
    await Kiosk.findByIdAndDelete(kioskId);
    logger.info('Kiosk rejected successfully', { kioskId: kiosk._id });

    res.json({ message: "Kiosk rejected and removed." });
  } catch (error) {
    logger.error('Reject kiosk error', { error: error.message, kioskId });
    res.status(500).json({ error: error.message });
  }
};


