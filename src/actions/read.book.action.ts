import { BookModel, IBook } from '../models/book.model';

// Acción para obtener todos los libros
export async function readBooksAction(): Promise<IBook[]> {
  const books = await BookModel.find({ isActive: true });
  return books;
}

// Acción para obtener un libro por ID
export async function readBookByIdAction(id: string): Promise<IBook | null> {
  const book = await BookModel.findOne({ _id: id, isActive: true });
  return book;
}

export default {
  readBooksAction,
  readBookByIdAction
}; 