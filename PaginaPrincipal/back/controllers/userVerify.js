import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // =======================================================
    // VERIFICACIÓN DE EMAIL CON ABSTRACT EMAIL REPUTATION API
    // =======================================================
    try {
      const apiKey = process.env.ABSTRACT_API_KEY;
      const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${cleanEmail}`;
      
      const abstractResponse = await axios.get(url);
      const status = abstractResponse.data?.email_deliverability?.status;

      if (status === 'undeliverable') {
        return res
          .status(400)
          .json({ error: 'El correo electrónico proporcionado no existe o no es válido.' });
      }
    } catch (apiError) {
      console.error('Error al conectar con Abstract API:', apiError.message);
    }

    // 3. Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Crear instancia del usuario
    const newUser = new User({
      name,
      email: cleanEmail,
      passwordHash,
      verified: true,
    });

    // 5. Guardar en MongoDB
    await newUser.save();

    // 6. Firmar el JWT con el _id del usuario
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: '1d' }
    );
    

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({ 
      message: 'Usuario registrado correctamente', 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });

  } catch (error) {
    console.error('Error en POST /api/users:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear usuario' });
  }
});

export default usersRouter;