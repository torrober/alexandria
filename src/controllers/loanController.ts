import { Request, Response } from 'express';
import Loan, { ILoan } from '../models/Loan';
import Book from '../models/Book';
import User from '../models/User';

// @desc    Obtener todos los préstamos
// @route   GET /api/loans
// @access  Private/Admin
export const getLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({})
      .populate({
        path: 'user',
        match: { isActive: true },
        select: 'name email'
      })
      .populate({
        path: 'book',
        match: { isActive: true },
        select: 'title author'
      });
    
    // Filtrar préstamos donde el libro o usuario haya sido desactivado
    const filteredLoans = loans.filter(loan => loan.book && loan.user);
    
    res.json(filteredLoans);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener préstamos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener préstamos del usuario actual
// @route   GET /api/loans/myloans
// @access  Private
export const getMyLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const loans = await Loan.find({ user: req.user._id })
      .populate({
        path: 'book',
        match: { isActive: true },
        select: 'title author'
      });
    
    // Filtrar préstamos donde el libro haya sido desactivado
    const filteredLoans = loans.filter(loan => loan.book);
    
    res.json(filteredLoans);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener préstamos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Crear un nuevo préstamo
// @route   POST /api/loans
// @access  Private
export const createLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const { bookId } = req.body;

    // Verificar si el libro existe, está activo y disponible
    const book = await Book.findOne({ _id: bookId, isActive: true });

    if (!book) {
      res.status(404).json({ message: 'Libro no encontrado o no disponible' });
      return;
    }

    if (book.quantity <= 0) {
      res.status(400).json({ message: 'El libro no está disponible para préstamo' });
      return;
    }

    // Verificar si el usuario actual está activo
    const user = await User.findOne({ _id: req.user._id, isActive: true });
    
    if (!user) {
      res.status(401).json({ message: 'Usuario desactivado, no puede realizar préstamos' });
      return;
    }

    // Verificar si el usuario ya tiene este libro en préstamo
    const existingLoan = await Loan.findOne({
      user: req.user._id,
      book: bookId,
      isReturned: false,
    });

    if (existingLoan) {
      res.status(400).json({ message: 'Ya tienes este libro en préstamo' });
      return;
    }

    // Crear el préstamo
    const loan = await Loan.create({
      user: req.user._id,
      book: bookId,
      borrowDate: new Date(),
    });

    // Actualizar la cantidad disponible del libro
    book.quantity -= 1;
    await book.save();

    if (loan) {
      res.status(201).json(loan);
    } else {
      res.status(400).json({ message: 'Datos de préstamo inválidos' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Devolver un libro prestado
// @route   PUT /api/loans/:id/return
// @access  Private
export const returnLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      res.status(404).json({ message: 'Préstamo no encontrado' });
      return;
    }

    // Verificar si es el usuario que tomó el libro o un administrador
    if (loan.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({ message: 'No autorizado para devolver este libro' });
      return;
    }

    if (loan.isReturned) {
      res.status(400).json({ message: 'Este libro ya ha sido devuelto' });
      return;
    }

    // Verificar que el libro siga activo
    const book = await Book.findOne({ _id: loan.book, isActive: true });
    
    if (!book) {
      // Permitir devolver el libro incluso si ha sido desactivado
      loan.isReturned = true;
      loan.returnDate = new Date();
      await loan.save();
      
      res.json({ 
        loan, 
        message: 'Préstamo devuelto. El libro ha sido desactivado del catálogo.' 
      });
      return;
    }

    // Marcar como devuelto
    loan.isReturned = true;
    loan.returnDate = new Date();
    await loan.save();

    // Aumentar la cantidad disponible del libro
    book.quantity += 1;
    await book.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({
      message: 'Error al devolver préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 