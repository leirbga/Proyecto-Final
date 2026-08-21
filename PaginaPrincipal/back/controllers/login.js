import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

   
    const cleanEmail = email.toLowerCase().trim();

  
    const userExist = await User.findOne({ email: cleanEmail });

    if (!userExist) {
      return res.status(400).json({ error: 'Email o Contraseña incorrectos' });
    }

    if (!userExist.verified) {
      return res.status(400).json({ error: 'Email no verificado' });
    }

  
    const isPasswordCorrect = await bcrypt.compare(password, userExist.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Email o Contraseña incorrectos' });
    }

   
    const userForToken = {
      id: userExist._id,
      email: userExist.email
    };

    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d'
    });

   
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });
    
  
  return res.status(200).json({
  message: 'Inicio de sesión exitoso',
  accessToken,
  user: {
    id: userExist._id,
    name: userExist.name,
    email: userExist.email,
    dev: userExist.dev
  }
});

  } catch (error) {
    console.error('Error en POST /api/login:', error);
    return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });

  }
});

export default loginRouter;