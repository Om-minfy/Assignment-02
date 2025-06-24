import { z } from 'zod';
import Message from '../models/Message.js';

const messageSchema = z.object({
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' })
});

export const createMessage = async (req, res, next) => {
  try {
    const { message } = messageSchema.parse(req.body);
    const newMessage = await Message.create({ message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const allMessages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: allMessages.length, data: allMessages });
  } catch (error) {
    next(error);
  }
};

export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};