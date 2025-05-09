// Definición de tipos globales
import { IUser } from '../models/User';
import { IBook } from '../models/Book';
import { ILoan } from '../models/Loan';

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

// Los tipos Book, User y Loan se importan directamente desde los modelos, 
// pero mantenemos estos para casos específicos donde no necesitamos todas
// las propiedades de los documentos de Mongoose

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