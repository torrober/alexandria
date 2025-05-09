import { Request, Response } from 'express';
import { readBooksAction, readBookByIdAction } from '../actions/read.book.action';
import createBookAction from '../actions/create.book.action';
import updateBookAction from '../actions/update.book.action';
import deleteBookAction from '../actions/delete.book.action';

// @desc    Obtener todos los libros
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await readBooksAction();
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
    const book = await readBookByIdAction(req.params.id);
    
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
    
    const book = await createBookAction({
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
      res.status(400).json({ message: 'El libro con ese ISBN ya existe' });
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

    const updatedBook = await updateBookAction(req.params.id, {
      title,
      author,
      isbn,
      publishedYear,
      genre,
      quantity,
    });

    if (updatedBook) {
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
    const success = await deleteBookAction(req.params.id);

    if (success) {
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