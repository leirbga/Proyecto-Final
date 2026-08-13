import jwt from 'jsonwebtoken';

const userExtractor = (req, res, next) => {
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

export default userExtractor;