import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para extender Document
export interface ILoan extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  borrowDate: Date;
  returnDate?: Date;
  isReturned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Por favor ingrese un usuario'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Por favor ingrese un libro'],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LoanModel = mongoose.model<ILoan>('Loan', loanSchema);

export { LoanModel, loanSchema }; 