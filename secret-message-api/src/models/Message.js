import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, minlength: 10 }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);