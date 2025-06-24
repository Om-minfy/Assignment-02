import express from 'express';
import protect from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/:id/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    return res.status(200).json({ message: `Now following ${userToFollow.username}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;