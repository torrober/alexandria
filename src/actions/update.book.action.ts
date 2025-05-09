import { BookModel, IBook } from '../models/book.model';

interface BookUpdateData {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
  quantity?: number;
}

// Acción para actualizar un libro
export async function updateBookAction(id: string, bookData: BookUpdateData): Promise<IBook | null> {
  const book = await BookModel.findOne({ _id: id, isActive: true });

  if (!book) {
    return null;
  }

  if (bookData.title) book.title = bookData.title;
  if (bookData.author) book.author = bookData.author;
  if (bookData.isbn) book.isbn = bookData.isbn;
  if (bookData.publishedYear) book.publishedYear = bookData.publishedYear;
  if (bookData.genre) book.genre = bookData.genre;
  if (bookData.quantity !== undefined) book.quantity = bookData.quantity;

  const updatedBook = await book.save();
  return updatedBook;
}

export default updateBookAction; 