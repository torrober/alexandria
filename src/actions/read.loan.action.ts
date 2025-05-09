import { LoanModel, ILoan } from '../models/loan.model';

// Acción para obtener todos los préstamos
export async function readLoansAction(): Promise<ILoan[]> {
  const loans = await LoanModel.find()
    .populate('user', 'name email')
    .populate('book', 'title author');
  return loans;
}

// Acción para obtener un préstamo por ID
export async function readLoanByIdAction(id: string): Promise<ILoan | null> {
  const loan = await LoanModel.findById(id)
    .populate('user', 'name email')
    .populate('book', 'title author');
  return loan;
}

// Acción para obtener préstamos por usuario
export async function readLoansByUserAction(userId: string): Promise<ILoan[]> {
  const loans = await LoanModel.find({ user: userId })
    .populate('book', 'title author');
  return loans;
}

export default {
  readLoansAction,
  readLoanByIdAction,
  readLoansByUserAction
}; 