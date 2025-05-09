import { LoanModel, ILoan } from '../models/loan.model';
import { BookModel } from '../models/book.model';
import mongoose from 'mongoose';

// Acción para eliminar un préstamo (cancelar)
export async function deleteLoanAction(id: string): Promise<boolean> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Buscar el préstamo
    const loan = await LoanModel.findById(id).session(session);
    
    if (!loan) {
      await session.abortTransaction();
      session.endSession();
      return false;
    }

    // Si el préstamo no ha sido devuelto, incrementar la cantidad de libros disponibles
    if (!loan.isReturned) {
      const book = await BookModel.findById(loan.book).session(session);
      if (book) {
        book.quantity += 1;
        await book.save({ session });
      }
    }

    // Eliminar el préstamo
    await LoanModel.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export default deleteLoanAction; 