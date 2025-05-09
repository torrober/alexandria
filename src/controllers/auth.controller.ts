import { Request, Response } from 'express';
import loginAction from '../actions/auth.action';
import createUserAction from '../actions/create.user.action';
import { readUserByIdAction } from '../actions/read.user.action';

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const authData = await loginAction({ email, password });

    if (authData) {
      res.json(authData);
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await createUserAction({
      name,
      email,
      password,
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
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const user = await readUserByIdAction(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener perfil',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 