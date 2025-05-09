import { readUserByEmailAction } from './read.user.action';
import jwt from 'jsonwebtoken';

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

// Acción para autenticar un usuario
export async function loginAction(loginData: LoginData): Promise<AuthResponse | null> {
  const { email, password } = loginData;

  // Buscar usuario por email
  const user = await readUserByEmailAction(email);

  if (!user || !(await user.matchPassword(password))) {
    return null;
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'somesecret',
    { expiresIn: '30d' }
  );

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
}

export default loginAction; 