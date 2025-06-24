import express from 'express';
import Vibe from '../models/Vibe.js';
import protect from '../middleware/auth.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const vibes = await Vibe.find()
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Vibe.countDocuments();

  const pagination = {};
  if (skip + limit < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({ count: vibes.length, pagination, data: vibes });
});


router.post('/', protect, async (req, res) => {
  const { vibeText, mood, song } = req.body;

  const vibe = await Vibe.create({
    user: req.user._id,
    vibeText,
    mood,
    song,
  });

  res.status(201).json(vibe);
});

router.get('/:id', async (req, res, next) => {
  try {
    const vibe = await Vibe.findById(req.params.id).populate('user', 'username');
    if (!vibe) {
      return res.status(404).json({ success: false, message: 'That vibe is off the grid, not found.' });
    }
    res.status(200).json(vibe);
  } catch (error) {
    next(error);
  }
});


router.put('/:id/like', protect, async (req, res, next) => {
  const vibe = await Vibe.findById(req.params.id);
  if (!vibe) return next(new ErrorResponse('Vibe not found', 404));

  const index = vibe.likes.indexOf(req.user.id);
  if (index === -1) {
    vibe.likes.push(req.user.id);
  } else {
    vibe.likes.splice(index, 1);
  }

  await vibe.save();
  res.status(200).json(vibe);
});

router.get('/feed', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('following');

  const vibes = await Vibe.find({ user: { $in: user.following } })
    .sort({ createdAt: -1 })
    .populate('user', 'username');

  res.status(200).json(vibes);
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const vibe = await Vibe.findById(req.params.id);
    if (!vibe) {
      return res.status(404).json({ message: 'Vibe not found' });
    }

    if (vibe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this vibe' });
    }

    await Vibe.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Vibe deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;