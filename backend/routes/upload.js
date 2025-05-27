const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Video = require('../models/video');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', upload.single('videoFile'), async (req, res) => {
  try {
    const { title, description, type, videoUrl, price, creatorId } = req.body;
    
    const videoData = { title, description, type, creatorId };

    if (type === 'short') {
      if (!req.file) {
        return res.status(400).json({ error: 'Video file required for shorts' });
      }
      videoData.localFilePath = req.file.path;
    }

    if (type === 'long') {
      // Clean up uploaded file for long videos
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL required for long videos' });
      }
      videoData.videoUrl = videoUrl;
      videoData.price = price || 0;
    }

    const video = new Video(videoData);
    await video.save();

    res.status(201).json({ message: 'Video uploaded', video });
  } catch (err) {
    console.error('Upload error:', err); 
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;