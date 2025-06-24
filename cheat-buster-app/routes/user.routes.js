import express from 'express';
import { searchUser, getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/search', searchUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;