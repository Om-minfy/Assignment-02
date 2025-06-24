import { Router } from 'express';
import { createMessage, getAllMessages, getMessageById, deleteMessage } from '../controllers/messageController.js';

const router = Router();

router.route('/')
  .post(createMessage)
  .get(getAllMessages);

router.route('/:id')
  .get(getMessageById)
  .delete(deleteMessage);

export default router;
