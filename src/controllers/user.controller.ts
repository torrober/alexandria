import { Request, Response } from 'express';
import { readUsersAction, readUserByIdAction } from '../actions/read.user.action';
import createUserAction from '../actions/create.user.action';
import updateUserAction from '../actions/update.user.action';
import deleteUserAction from '../actions/delete.user.action';

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await readUsersAction();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await readUserByIdAction(req.params.id);
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    
    const user = await createUserAction({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'El usuario con ese email ya existe' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Actualizar un usuario
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const updatedUser = await updateUserAction(req.params.id, {
      name,
      email,
      password,
      role,
    });

    if (updatedUser) {
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado o email ya en uso' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Desactivar un usuario (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await deleteUserAction(req.params.id);

    if (success) {
      res.json({ message: 'Usuario desactivado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al desactivar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 