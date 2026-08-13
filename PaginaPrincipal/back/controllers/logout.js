import express from 'express';

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.sendStatus(204);
  }

  
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});

export default logoutRouter;