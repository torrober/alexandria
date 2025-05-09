import { UserModel, IUser } from '../models/user.model';

interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Acción para crear un usuario
export async function createUserAction(userData: UserCreateData): Promise<IUser | null> {
  // Verificar si el usuario ya existe por email
  const userExists = await UserModel.findOne({ email: userData.email });

  if (userExists) {
    return null;
  }

  // Crear nuevo usuario
  const user = await UserModel.create(userData);
  return user;
}

export default createUserAction; 