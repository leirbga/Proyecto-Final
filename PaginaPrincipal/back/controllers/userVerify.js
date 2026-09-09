import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import User from '../models/users.js'; // Asegúrate de ajustar la ruta de tu modelo
import { userExtractor } from '../../../middleware/auth.js';

const usersRouter = Router();

// =======================================================
// RUTA DE REGISTRO DE USUARIO (Pública)
// =======================================================
usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Verificación con Abstract API
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

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email: cleanEmail,
      passwordHash,
      verified: true,
    });

    await newUser.save();

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

// =======================================================
// RUTA MIS COMPRAS (Protegida con userExtractor)
// =======================================================
usersRouter.get('/mis-compras', userExtractor, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    // Hacemos populate del modelo CreateWeb referenciado en webPostId
    const user = await User.findById(userId).populate('buys.webPostId');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Mapeamos los datos fusionando la compra con los datos del post original
    const misCompras = user.buys
      .map(buy => {
        const post = buy.webPostId;
        if (!post) return null; // Si el post fue eliminado de la BD, se descarta

        return {
          id: post._id || post.id,
          title: buy.title || post.title,
          image: post.image,
          url: post.url,
          whatsappCreator: post.whatsappCreator || post.whatsapp || "",
          pricePaid: buy.pricePaid,
          purchasedAt: buy.purchasedAt
        };
      })
      .filter(Boolean); // Elimina valores null

    return res.status(200).json(misCompras);
  } catch (error) {
    console.error('Error en GET /mis-compras:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default usersRouter;