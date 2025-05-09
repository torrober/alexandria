import express from 'express';
import { registerUser, loginUser, getUserProfile, deleteUser } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Rutas para autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.delete('/:id', protect, deleteUser);

export default router; 