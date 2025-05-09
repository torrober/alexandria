import { UserModel, IUser } from '../models/user.model';

// Acción para desactivar un usuario (soft delete)
export async function deleteUserAction(id: string): Promise<boolean> {
  const user = await UserModel.findOne({ _id: id, isActive: true });

  if (!user) {
    return false;
  }

  // Realizar soft delete
  user.isActive = false;
  await user.save();
  return true;
}

export default deleteUserAction; 