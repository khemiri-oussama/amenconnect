// routes/incidents.js
const express = require('express');
const router = express.Router();
const Incident = require('../models/incident');

// GET /api/incidents - Retrieve all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/incidents - Create a new incident
router.post('/', async (req, res) => {
  const { totemId, type, description } = req.body;
  if (!totemId || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const incident = new Incident({ totemId, type, description });
    await incident.save();
    res.json({ message: 'Incident logged successfully', incident });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/incidents/:id - Delete an incident by its ID
router.delete('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
