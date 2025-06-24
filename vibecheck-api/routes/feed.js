import express from 'express';
import protect from '../middleware/auth.js';
import User from '../models/User.js';
import Vibe from '../models/Vibe.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vibes = await Vibe.find({ user: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .populate('user', 'username');

    res.status(200).json(vibes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;