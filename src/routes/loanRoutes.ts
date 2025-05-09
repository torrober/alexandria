import express from 'express';
import { getLoans, getMyLoans, createLoan, returnLoan } from '../controllers/loanController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Rutas para préstamos
router.route('/')
  .get(protect, admin, getLoans)
  .post(protect, createLoan);

router.get('/myloans', protect, getMyLoans);
router.put('/:id/return', protect, returnLoan);

export default router; 