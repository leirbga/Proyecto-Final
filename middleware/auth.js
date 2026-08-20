import jwt from 'jsonwebtoken';
import User from '../PaginaPrincipal/back/models/users.js';


export const userExtractor = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'No has iniciado sesión' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Sesión inválida o expirada' });
  }
};


export const isDev = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Acceso denegado. No hay sesión activa.' });
    }

    // Buscamos al usuario en la BD para verificar el flag 'dev'
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!user.dev) {
      return res.status(403).json({ error: 'Acceso restringido. Solo para desarrolladores.' });
    }

    // Reemplazamos req.user con el documento completo de Mongoose si es necesario
    req.user = user;
    next();

  } catch (error) {
    console.error('Error en middleware isDev:', error);
    return res.status(500).json({ error: 'Error al verificar los permisos del usuario' });
  }
};