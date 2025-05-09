import { BookModel, IBook } from '../models/book.model';

// Acción para desactivar un libro (soft delete)
export async function deleteBookAction(id: string): Promise<boolean> {
  const book = await BookModel.findOne({ _id: id, isActive: true });

  if (!book) {
    return false;
  }

  // Realizar soft delete
  book.isActive = false;
  await book.save();
  return true;
}

export default deleteBookAction; 