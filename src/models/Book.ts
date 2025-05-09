import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para extender Document
export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  quantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor ingrese un título'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Por favor ingrese un autor'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'Por favor ingrese un ISBN'],
      unique: true,
      trim: true,
    },
    publishedYear: {
      type: Number,
      required: [true, 'Por favor ingrese un año de publicación'],
    },
    genre: {
      type: String,
      required: [true, 'Por favor ingrese un género'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Por favor ingrese una cantidad'],
      default: 1,
      min: [0, 'La cantidad no puede ser negativa'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book; 