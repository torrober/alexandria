import { LoanModel, ILoan } from '../models/loan.model';
import { BookModel } from '../models/book.model';
import mongoose from 'mongoose';

// Acción para marcar un préstamo como devuelto
export async function returnLoanAction(id: string): Promise<ILoan | null> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar el préstamo
    const loan = await LoanModel.findById(id).session(session);
    
    if (!loan || loan.isReturned) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    // Marcar como devuelto
    loan.isReturned = true;
    loan.returnDate = new Date();
    await loan.save({ session });

    // Incrementar la cantidad de libros disponibles
    const book = await BookModel.findById(loan.book).session(session);
    if (book) {
      book.quantity += 1;
      await book.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return loan;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export default returnLoanAction; 