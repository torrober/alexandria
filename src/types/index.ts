// Definición de tipos globales
import { IUser } from '../models/user.model';
import { IBook } from '../models/book.model';
import { ILoan } from '../models/loan.model';

// Para extender tipos de Express
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Otros tipos globales que puedan ser necesarios
export interface ErrorResponse {
  message: string;
  stack?: string;
}

// Re-exportamos las interfaces para que sean accesibles desde este módulo
export { IUser, IBook, ILoan };

// DTO para libros (Data Transfer Object)
export interface BookDTO {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  quantity: number;
}

// DTO para usuarios (sin password)
export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// DTO para préstamos
export interface LoanDTO {
  id?: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate?: Date;
  isReturned: boolean;
} 