const express = require('express');
const router = express.Router();
const Video = require('../models/video');

router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });

    const result = videos.map(v => ({
      ...v.toObject(),
      videoUrl: v.type === 'short' && v.localFilePath
        ? `http://localhost:5000/uploads/${v.localFilePath.replace(/\\/g, '/').replace('uploads/', '')}`
        : undefined
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Could not load videos' });
  }
});

module.exports = router;
