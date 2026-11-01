const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// @route   POST /api/requests
router.post('/', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();

    // Real-time Socket.IO alert
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new-emergency', {
        message: `🚨 URGENT: ${request.bloodGroup} blood needed at ${request.hospital}`,
        request: request
      });
      console.log('📡 Broadcasted real-time alert for:', request.patientName);
    }

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   GET /api/requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;