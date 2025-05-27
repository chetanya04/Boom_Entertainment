const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Video = require('../models/video');

router.post('/', async (req, res) => {
  const { userId, videoId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ error: 'Invalid user or video ID' });
  }

  try {
    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!user || !video) {
      return res.status(404).json({ error: 'User or video not found' });
    }

    if (user.purchasedVideos.includes(videoId)) {
      return res.status(400).json({ error: 'You already own this video' });
    }

    if (user.walletBalance < video.price) {
      return res.status(400).json({ error: 'Not enough balance' });
    }

    user.walletBalance -= video.price;
    user.purchasedVideos.push(videoId);
    await user.save();

    res.json({ message: 'Video purchased', balance: user.walletBalance });
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
