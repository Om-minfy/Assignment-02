import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.get('/', (req, res) => res.send('Cheat Buster API is up!'));

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});