import { UserModel, IUser } from '../models/user.model';

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

// Acción para actualizar un usuario
export async function updateUserAction(id: string, userData: UserUpdateData): Promise<IUser | null> {
  const user = await UserModel.findOne({ _id: id, isActive: true });

  if (!user) {
    return null;
  }

  // Verificar si se está cambiando el email y si ya existe
  if (userData.email && userData.email !== user.email) {
    const emailExists = await UserModel.findOne({ email: userData.email });
    if (emailExists) {
      return null;
    }
  }

  if (userData.name) user.name = userData.name;
  if (userData.email) user.email = userData.email;
  if (userData.password) user.password = userData.password;
  if (userData.role) user.role = userData.role;

  const updatedUser = await user.save();
  return updatedUser;
}

export default updateUserAction; 