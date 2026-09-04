import createNotificacion from '../../PaginaPrincipal/componentes/notificaciones.js';

document.addEventListener('DOMContentLoaded', () => {
  obtenerTotalCarrito();

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', procesarPago);
  }
});

// 1. Mostrar el total del carrito en el resumen del checkout
const obtenerTotalCarrito = async () => {
  try {
    const { data: posts } = await axios.get('/api/Carrito');
    
    if (!posts || posts.length === 0) {
      createNotificacion?.(true, 'No hay items en tu carrito');
      setTimeout(() => window.location.href = '/Web-Clientes/Carrito', 1500);
      return;
    }

    const total = posts.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    const totalEl = document.getElementById('checkout-total');
    if (totalEl) totalEl.textContent = `${total}$`;

  } catch (error) {
    console.error('Error al cargar items del carrito:', error);
    createNotificacion?.(true, 'Error al conectar con el carrito');
  }
};

// 2. Procesar el pago y registrar la compra en la BD
const procesarPago = async (e) => {
  e.preventDefault();

  const btnSubmit = document.getElementById('btn-confirmar-pago');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Procesando pago...';
  }

  try {
    // Se ejecuta la llamada al backend que inserta las compras en 'buys' y limpia 'carrito'
    await axios.post('/api/Carrito/comprar');

    createNotificacion?.(false, '¡Pago procesado exitosamente!');

    // Redirigir al usuario tras completar la compra
    setTimeout(() => {
      window.location.href = '/Web-Clientes/MisPaginas';
    }, 2000);

  } catch (error) {
    console.error('Error al procesar la compra:', error);
    const mensajeError = error.response?.data?.error || 'No se pudo procesar la transacción';
    createNotificacion?.(true, mensajeError);

    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Pagar y Confirmar';
    }
  }
};