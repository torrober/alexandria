import { UserModel, IUser } from '../models/user.model';

// Acción para obtener todos los usuarios
export async function readUsersAction(): Promise<IUser[]> {
  const users = await UserModel.find({ isActive: true }).select('-password');
  return users;
}

// Acción para obtener un usuario por ID
export async function readUserByIdAction(id: string): Promise<IUser | null> {
  const user = await UserModel.findOne({ _id: id, isActive: true }).select('-password');
  return user;
}

// Acción para obtener un usuario por email (para autenticación)
export async function readUserByEmailAction(email: string): Promise<IUser | null> {
  const user = await UserModel.findOne({ email, isActive: true }).select('+password');
  return user;
}

export default {
  readUsersAction,
  readUserByIdAction,
  readUserByEmailAction
}; 