import { Request, Response } from 'express';
// @ts-ignore
const jwt = require('jsonwebtoken');
import User, { IUser } from '../models/User';

// Generar JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    // Crear nuevo usuario
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user', // Usar el rol proporcionado o 'user' por defecto
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email, isActive: true }).select('+password');

    // Verificar usuario y contraseña
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const user = await User.findById(req.user._id);

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

// @desc    Desactivar un usuario (soft delete)
// @route   DELETE /api/auth/:id
// @access  Private
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar que el usuario sea el mismo que está autenticado o que sea un administrador
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({ message: 'No autorizado para desactivar este usuario' });
      return;
    }

    // Realizar soft delete
    user.isActive = false;
    await user.save();

    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al desactivar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 