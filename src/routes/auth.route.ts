import express from 'express';
import { login, register, getUserProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/register', register);
router.get('/profile', protect, getUserProfile);

export default router; 