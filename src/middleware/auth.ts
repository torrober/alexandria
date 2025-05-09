import { Request, Response, NextFunction } from 'express';
// @ts-ignore
const jwt = require('jsonwebtoken');
import User, { IUser } from '../models/User';

// Extendiendo la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
}

// Middleware para proteger rutas
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del encabezado
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // Obtener usuario del token y verificar que esté activo
      const user = await User.findOne({ _id: decoded.id, isActive: true }).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'No autorizado, usuario desactivado' });
        return;
      }

      // Asignar el usuario al request
      req.user = user as IUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, token fallido' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
    return;
  }
};

// Middleware para roles de administrador
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'No autorizado como administrador' });
  }
}; 