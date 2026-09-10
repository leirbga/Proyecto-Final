import express from 'express';
import CreateWeb from '../models/createWeb.js';
import User from '../models/users.js';

const createWebRouter = express.Router();

// ==========================================
// 1. RUTA ESPECÍFICA: MIS PÁGINAS (Debe ir ANTES de GET '/')
// ==========================================
createWebRouter.get('/MisPaginas', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    // Incluimos 'buyers' para contar las ventas de la plantilla
    const posts = await CreateWeb.find(
      { user: userId },
      'title description price theme url image whatsappCreator views buyers _id'
    ).sort({ createdAt: -1 });

    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/CreateWeb/:id (Editar plantilla)
createWebRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, theme, url, whatsappCreator } = req.body;
    const userId = req.user?.id || req.user?._id;

    const updatedPost = await CreateWeb.findOneAndUpdate(
      { _id: id, user: userId },
      { 
        title, 
        description, 
        price: Number(price), 
        theme, 
        url, 
        whatsappCreator 
      },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ error: 'Post no encontrado o sin autorización' });

    return res.status(200).json({ message: 'Plantilla actualizada', post: updatedPost });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// ==========================================
// 2. RUTA GENERAL: TIENDA COMPLETA Y FILTROS
// ==========================================
createWebRouter.get('/', async (req, res) => {
  try {
    const { theme, price } = req.query;
    const userId = req.user?.id || req.user?._id;

    const filter = {};

    if (theme && theme !== 'todas') {
      filter.theme = theme;
    }

    if (price && price !== 'todos') {
      if (price === '0') {
        filter.price = 0;
      } else if (price === '15') {
        filter.price = { $lte: 15 };
      } else if (price === '20+' || price === '20') {
        filter.price = { $gt: 20 };
      } else if (!isNaN(price)) {
        filter.price = { $lte: Number(price) };
      }
    }

    const posts = await CreateWeb.find(
      filter,
      'title description price theme url image whatsappCreator _id'
    ).sort({ createdAt: -1 });

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
    console.error('Error al obtener los posts:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. RUTA POST: CREAR TEMPLATE
// ==========================================
createWebRouter.post('/', async (req, res) => {
  try {
    const { title, description, price, theme, url, image, whatsappCreator } = req.body;
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
      whatsappCreator,
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


// DELETE /api/CreateWeb/:id (Eliminar plantilla)
createWebRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const deletedPost = await CreateWeb.findOneAndDelete({ _id: id, user: userId });

    if (!deletedPost) return res.status(404).json({ error: 'Post no encontrado o sin autorización' });

    return res.status(200).json({ message: 'Plantilla eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


createWebRouter.patch('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID de la plantilla no proporcionado' });
    }

    // Incrementar de forma atómica el contador de vistas
    const updatedPost = await CreateWeb.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Plantilla no encontrada' });
    }

    return res.status(200).json({ views: updatedPost.views });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default createWebRouter;