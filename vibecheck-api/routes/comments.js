import express from 'express';
import Comment from '../models/Comment.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, async (req, res) => {
  const comment = await Comment.create({
    user: req.user.id,
    vibe: req.params.vibeId,
    text: req.body.text
  });
  res.status(201).json(comment);
});

router.get('/', async (req, res) => {
  const comments = await Comment.find({ vibe: req.params.vibeId }).populate('user', 'username');
  res.status(200).json(comments);
});

export default router;