import mongoose from 'mongoose';

const vibeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  vibeText: { type: String, required: true },
  mood: { type: String },
  song: { type: String },
}, { timestamps: true });

export default mongoose.model('Vibe', vibeSchema);