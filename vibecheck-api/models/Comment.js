import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  vibe: { type: mongoose.Schema.Types.ObjectId, ref: 'Vibe', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);