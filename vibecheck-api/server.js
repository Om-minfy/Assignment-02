import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import vibeRoutes from './routes/vibes.js';
import commentRoutes from './routes/comments.js';
import errorHandler from './middleware/error.js';
import userRoutes from './routes/users.js';
import feedRoutes from './routes/feed.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🎵 Welcome to VibeCheck API!');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vibes', vibeRoutes);
app.use('/api/v1/vibes/:vibeId/comments', commentRoutes);
app.use(errorHandler);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/feed', feedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server blasting off on port ${PORT}`));