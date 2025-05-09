import { LoanModel, ILoan } from '../models/loan.model';
import { BookModel } from '../models/book.model';
import mongoose from 'mongoose';

interface LoanCreateData {
  user: string;
  book: string;
  borrowDate?: Date;
}

// Acción para crear un préstamo
export async function createLoanAction(loanData: LoanCreateData): Promise<ILoan | null> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verificar disponibilidad del libro
    const book = await BookModel.findById(loanData.book);
    
    if (!book || book.quantity <= 0) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    // Reducir la cantidad de libros disponibles
    book.quantity -= 1;
    await book.save({ session });

    // Crear el préstamo
    const loan = await LoanModel.create([{
      user: loanData.user,
      book: loanData.book,
      borrowDate: loanData.borrowDate || new Date(),
      isReturned: false
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return loan[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export default createLoanAction; 