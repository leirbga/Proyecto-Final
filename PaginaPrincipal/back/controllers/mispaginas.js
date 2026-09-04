import express from 'express';
import User from '../models/users.js';
import CreateWeb from '../models/createWeb.js';


const misPaginasRouter = express.Router();

misPaginasRouter.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // 1. Buscar al usuario y obtener sus compras
    const user = await User.findById(userId);
    if (!user || !user.buys || user.buys.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Extraer los IDs comprados
    const compradosIds = user.buys.map(buy => 
      buy.webPostId ? buy.webPostId.toString() : buy.toString()
    );

    // 3. Buscar las publicaciones en la colección CreateWeb
    const misPaginas = await CreateWeb.find({ _id: { $in: compradosIds } });

    return res.status(200).json(misPaginas);
  } catch (error) {
    console.error('Error al obtener mis páginas:', error);
    return res.status(500).json({ error: 'Error del servidor al obtener las páginas' });
  }
});

export default misPaginasRouter;