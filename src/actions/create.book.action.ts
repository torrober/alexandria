import { BookModel, IBook } from '../models/book.model';

interface BookCreateData {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  quantity: number;
}

// Acción para crear un libro
export async function createBookAction(bookData: BookCreateData): Promise<IBook | null> {
  // Verificar si el libro ya existe por ISBN
  const bookExists = await BookModel.findOne({ isbn: bookData.isbn });

  if (bookExists) {
    return null;
  }

  // Crear nuevo libro
  const book = await BookModel.create(bookData);
  return book;
}

export default createBookAction; 