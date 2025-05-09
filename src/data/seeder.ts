import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { BookModel } from '../models/book.model';
import { LoanModel } from '../models/loan.model';
import connectDB from '../config/db';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Datos de ejemplo para usuarios
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    isActive: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    isActive: true,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    isActive: true,
  },
  {
    name: 'Inactive User',
    email: 'inactive@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    isActive: false,
  },
];

// Datos de ejemplo para libros
const books = [
  {
    title: 'El Quijote',
    author: 'Miguel de Cervantes',
    isbn: '9788420412146',
    publishedYear: 1605,
    genre: 'Novela',
    quantity: 5,
    isActive: true,
  },
  {
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '9788420471839',
    publishedYear: 1967,
    genre: 'Realismo mágico',
    quantity: 3,
    isActive: true,
  },
  {
    title: 'Harry Potter y la piedra filosofal',
    author: 'J.K. Rowling',
    isbn: '9788478884459',
    publishedYear: 1997,
    genre: 'Fantasía',
    quantity: 10,
    isActive: true,
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9788499890944',
    publishedYear: 1949,
    genre: 'Distopía',
    quantity: 7,
    isActive: true,
  },
  {
    title: 'El principito',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9788478887194',
    publishedYear: 1943,
    genre: 'Fábula',
    quantity: 4,
    isActive: true,
  },
  {
    title: 'Libro descatalogado',
    author: 'Autor Ejemplo',
    isbn: '9788412345678',
    publishedYear: 2010,
    genre: 'Ejemplo',
    quantity: 0,
    isActive: false,
  },
];

// Importar datos
const importData = async (): Promise<void> => {
  try {
    // Limpiar la base de datos
    await UserModel.deleteMany({});
    await BookModel.deleteMany({});
    await LoanModel.deleteMany({});

    // Insertar usuarios
    const createdUsers = await UserModel.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Insertar libros
    const createdBooks = await BookModel.insertMany(books);
    const firstBook = createdBooks[0]._id;
    const secondBook = createdBooks[1]._id;
    const inactiveBook = createdBooks[5]._id;

    // Crear algunos préstamos de ejemplo
    const loans = [
      {
        user: createdUsers[1]._id,
        book: firstBook,
        borrowDate: new Date(),
        isReturned: false,
      },
      {
        user: createdUsers[2]._id,
        book: secondBook,
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
        returnDate: new Date(),
        isReturned: true,
      },
      {
        user: createdUsers[1]._id,
        book: inactiveBook,
        borrowDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 días atrás
        isReturned: false,
      },
    ];

    await LoanModel.insertMany(loans);

    console.log('Datos importados correctamente');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

// Eliminar datos
const destroyData = async (): Promise<void> => {
  try {
    // Limpiar la base de datos
    await UserModel.deleteMany({});
    await BookModel.deleteMany({});
    await LoanModel.deleteMany({});

    console.log('Datos eliminados correctamente');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

// Ejecutar según el argumento pasado al script
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 