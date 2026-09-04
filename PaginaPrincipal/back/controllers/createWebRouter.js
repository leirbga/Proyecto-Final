import express from 'express';
import CreateWeb from '../models/createWeb.js';
import User from '../models/users.js';

const createWebRouter = express.Router();

createWebRouter.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const posts = await CreateWeb.find({}, 'title description price theme url image');

    let userCarritoIds = [];
    let userBuysIds = [];

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userCarritoIds = user.carrito.map(id => id.toString());
        userBuysIds = user.buys.map(buy => buy.webPostId ? buy.webPostId.toString() : buy.toString());
      }
    }

    return res.status(200).json({
      posts,
      userCarritoIds,
      userBuysIds
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

createWebRouter.get('/price/:price', async (req, res) => {
  try {
    const { price } = req.params;
    let query = {};

    if (price === '0') {
      query.price = 0; // Gratis
    } else if (price === '15') {
      query.price = { $lte: 15 }; // Menor o igual a $15 ($1 a $15)
    } else if (price === '20+') {
      query.price = { $gt: 20 }; // Mayor a $20
    }

    const posts = await CreateWeb.find(query, 'title description price theme url image _id').sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener los posts por precio:', error);
    return res.status(500).json({ error: 'Error al cargar las publicaciones de MongoDB' });
  }
});

createWebRouter.get('/:theme', async (req, res) => {
  try {
    const { theme } = req.params;
    const posts = await CreateWeb.find({theme}, 'title description price theme url image _id')
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    return res.status(500).json({ error: 'Error al cargar las publicaciones de MongoDB' });
  }
});

createWebRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, theme, url, image } = req.body;

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