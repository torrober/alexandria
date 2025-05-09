import { Request, Response } from 'express';
import { readLoansAction, readLoanByIdAction, readLoansByUserAction } from '../actions/read.loan.action';
import createLoanAction from '../actions/create.loan.action';
import returnLoanAction from '../actions/update.loan.action';
import deleteLoanAction from '../actions/delete.loan.action';

// @desc    Obtener todos los préstamos
// @route   GET /api/loans
// @access  Private/Admin
export const getLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await readLoansAction();
    res.json(loans);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener préstamos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener un préstamo por ID
// @route   GET /api/loans/:id
// @access  Private
export const getLoanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const loan = await readLoanByIdAction(req.params.id);
    
    if (loan) {
      res.json(loan);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener préstamos por usuario
// @route   GET /api/loans/user/:userId
// @access  Private
export const getLoansByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await readLoansByUserAction(req.params.userId);
    res.json(loans);
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
    const { user, book, borrowDate } = req.body;
    
    const loan = await createLoanAction({
      user,
      book,
      borrowDate,
    });

    if (loan) {
      res.status(201).json(loan);
    } else {
      res.status(400).json({ message: 'No hay copias disponibles de este libro' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Marcar préstamo como devuelto
// @route   PUT /api/loans/:id/return
// @access  Private
export const returnLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedLoan = await returnLoanAction(req.params.id);

    if (updatedLoan) {
      res.json(updatedLoan);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado o ya devuelto' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al devolver préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Eliminar un préstamo
// @route   DELETE /api/loans/:id
// @access  Private/Admin
export const deleteLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await deleteLoanAction(req.params.id);

    if (success) {
      res.json({ message: 'Préstamo eliminado' });
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar préstamo',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 