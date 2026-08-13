import jwt from 'jsonwebtoken';
import User from '../models/users.js';

export const isDev = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No hay sesión activa.' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!user.dev) {
      return res.status(403).json({ error: 'Acceso restringido. Solo para desarrolladores.' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Error en middleware isDev:', error);
    return res.status(401).json({ error: 'Sesión expirada o token no válido' });
  }
};