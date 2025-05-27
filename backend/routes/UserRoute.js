const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Create or fetch user by Firebase ID
router.post('/initialize', async (req, res) => {
  const { firebaseId, name, email } = req.body;

  try {
    let user = await User.findOne({ firebaseId });

    if (!user) {
      user = new User({ firebaseId, name, email, walletBalance: 500 });
      await user.save();
    }

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Unable to initialize user' });
  }
});

router.get('/:firebaseId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.params.firebaseId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/creator/:creatorId', async (req, res) => {
  const { creatorId } = req.params;

  try {
    let creator = null;

    if (mongoose.Types.ObjectId.isValid(creatorId)) {
      creator = await User.findById(creatorId);
    }

    if (!creator) {
      creator = await User.findOne({
        $or: [
          { firebaseId: creatorId },
          { name: creatorId },
          { displayName: creatorId }
        ]
      });
    }

    if (!creator) return res.status(404).json({ error: 'Creator not found' });

    res.json({
      _id: creator._id,
      name: creator.name,
      displayName: creator.displayName,
      firebaseId: creator.firebaseId
    });
  } catch {
    res.status(500).json({ error: 'Unable to fetch creator' });
  }
});

module.exports = router;
