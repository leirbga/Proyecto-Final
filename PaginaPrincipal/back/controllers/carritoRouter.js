import express from 'express';
import User from '../models/users.js';

const carritoRouter = express.Router();

carritoRouter.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = await User.findById(userId).populate('carrito');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(user.carrito);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return res.status(500).json({ error: 'Error al cargar los elementos del carrito' });
  }
});

carritoRouter.put('/', async (req, res) => {
  try {
    const { webPostId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!webPostId) {
      return res.status(400).json({ error: 'Se requiere el ID de la publicación' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { carrito: webPostId } },
      { new: true }
    ).populate('carrito');

    return res.status(200).json({
      message: 'Carrito actualizado con éxito',
      carrito: updatedUser.carrito
    });

  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    return res.status(500).json({ error: error.message });
  }
});

carritoRouter.delete('/:id', async (req, res) => {
  try {
    const webPostId = req.params.id;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { carrito: webPostId } },
      { new: true }
    ).populate('carrito');

    return res.status(200).json({
      message: 'Eliminado con éxito',
      carrito: updatedUser.carrito
    });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    return res.status(500).json({ error: error.message });
  }
});

carritoRouter.post('/comprar', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const user = await User.findById(userId).populate('carrito');

    if (!user || user.carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const nuevasCompras = user.carrito.map(post => ({
      webPostId: post._id,
      title: post.title,
      pricePaid: Number(post.price) || 0,
      purchasedAt: new Date()
    }));

    user.buys.push(...nuevasCompras);
    user.carrito = [];

    await user.save();

    return res.status(200).json({
      message: 'Compra realizada con éxito',
      buys: user.buys
    });

  } catch (error) {
    console.error('Error al procesar la compra:', error);
    return res.status(500).json({ error: 'Error al procesar la transacción' });
  }
});

export default carritoRouter;