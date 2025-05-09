import express from 'express';
import { getLoans, getLoanById, getLoansByUser, createLoan, returnLoan, deleteLoan } from '../controllers/loan.controller';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Rutas para préstamos
router.route('/')
  .get(protect, admin, getLoans)
  .post(protect, createLoan);

router.route('/:id')
  .get(protect, getLoanById)
  .delete(protect, admin, deleteLoan);

// Ruta para marcar como devuelto
router.route('/:id/return')
  .put(protect, returnLoan);

// Ruta para obtener préstamos por usuario
router.route('/user/:userId')
  .get(protect, getLoansByUser);

export default router; 