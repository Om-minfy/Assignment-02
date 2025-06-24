import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import protect from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ username, email, password });

  res.status(201).json({
    token: generateToken(user._id),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ token: generateToken(user._id) });
});

router.post('/:id/follow', protect, async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToFollow || userToFollow.id === currentUser.id)
    return res.status(400).json({ message: 'Invalid operation' });

  if (!currentUser.following.includes(userToFollow.id)) {
    currentUser.following.push(userToFollow.id);
    userToFollow.followers.push(currentUser.id);
    await currentUser.save();
    await userToFollow.save();
  }

  res.status(200).json({ message: 'Followed successfully' });
});

export default router;