import express from 'express';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/book.controller';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Rutas para libros
router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook);

router.route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

export default router; 