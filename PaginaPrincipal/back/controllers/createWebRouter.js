import express from 'express';
import CreateWeb from '../models/createWeb.js';

const createWebRouter = express.Router();

createWebRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, theme, url, image } = req.body;

    // req.user ya fue inyectado por userExtractor en app.js
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'No se pudo autenticar el usuario' });
    }

    const newPost = new CreateWeb({
      title,
      description,
      price: Number(price),
      theme,
      url,
      image,
      user: userId
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      message: 'Post publicado con éxito',
      post: savedPost
    });

  } catch (error) {
    console.error('Error al guardar el post:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default createWebRouter;