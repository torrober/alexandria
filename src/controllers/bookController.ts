import { Request, Response } from 'express';
import Book, { IBook } from '../models/Book';

// @desc    Obtener todos los libros
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find({ isActive: true });
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener libros',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener un libro por ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findOne({ _id: req.params.id, isActive: true });
    
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener libro',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Crear un nuevo libro
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, isbn, publishedYear, genre, quantity } = req.body;

    // Verificar si el libro ya existe por ISBN
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      res.status(400).json({ message: 'El libro con ese ISBN ya existe' });
      return;
    }

    // Crear nuevo libro
    const book = await Book.create({
      title,
      author,
      isbn,
      publishedYear,
      genre,
      quantity,
    });

    if (book) {
      res.status(201).json(book);
    } else {
      res.status(400).json({ message: 'Datos de libro inválidos' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear libro',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Actualizar un libro
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, isbn, publishedYear, genre, quantity } = req.body;

    const book = await Book.findOne({ _id: req.params.id, isActive: true });

    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.isbn = isbn || book.isbn;
      book.publishedYear = publishedYear || book.publishedYear;
      book.genre = genre || book.genre;
      book.quantity = quantity !== undefined ? quantity : book.quantity;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar libro',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Desactivar un libro (soft delete)
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findOne({ _id: req.params.id, isActive: true });

    if (book) {
      // Realizar soft delete
      book.isActive = false;
      await book.save();
      res.json({ message: 'Libro desactivado' });
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al desactivar libro',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 