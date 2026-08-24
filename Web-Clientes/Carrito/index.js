import createNotificacion from '../../PaginaPrincipal/componentes/notificaciones.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();

  // Redirección al presionar "Comprar"
  const btnComprar = document.getElementById('btn-comprar');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      const totalText = document.getElementById('cart-total')?.textContent;
      if (!totalText || totalText === '$0' || totalText === '0$') {
        return createNotificacion?.(true, 'Tu carrito está vacío');
      }
      
      // Redirecciona a la pestaña/vista de compra
      window.location.href = '/Web-Clientes/Compra';
    });
  }
});

const cargarCarrito = async () => {
  const cartContainer = document.getElementById('cart-list');
  const summaryContainer = document.getElementById('summary-items');
  const totalEl = document.getElementById('cart-total');

  if (!cartContainer) return;

  try {
    cartContainer.innerHTML = `<p class="text-center py-8 text-slate-400">Cargando tu carrito...</p>`;

    const { data: posts } = await axios.get('/api/Carrito');

    // Criterio: En caso de no tener páginas agregadas, el resumen y la lista aparecen en blanco / vacíos
    if (!posts || posts.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <p class="text-slate-400 mb-3">No tienes páginas agregadas al carrito.</p>
          <a href="/Web-Clientes" class="text-cyan-400 hover:underline text-sm font-bold">Explorar plantillas</a>
        </div>`;
      if (summaryContainer) summaryContainer.innerHTML = `<p class="text-xs text-slate-500 italic">Sin productos</p>`;
      if (totalEl) totalEl.textContent = '0$';
      return;
    }

    cartContainer.innerHTML = '';
    if (summaryContainer) summaryContainer.innerHTML = '';
    
    let totalAcumulado = 0;

    posts.forEach((post) => {
      const postId = post.id || post._id;
      const priceNum = Number(post.price) || 0;
      totalAcumulado += priceNum;

      // 1. Tarjeta en la lista (Maquetación según boceto)
      const card = document.createElement('article');
      card.className = 'bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row hover:border-slate-700 transition-all';

      card.innerHTML = `
        <!-- Imagen Izquierda -->
        <div class="sm:w-48 h-36 sm:h-auto bg-slate-950 flex-shrink-0 border-r border-slate-800">
          <img src="${post.image || '/img/placeholder.png'}" alt="${post.title}" class="w-full h-full object-cover">
        </div>

        <!-- Contenido Derecho -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Fila Superior: Título y Precio -->
            <div class="flex items-center justify-between gap-4 mb-2">
              <h3 class="font-bold text-white text-lg truncate">${post.title}</h3>
              <span class="text-cyan-400 font-extrabold text-lg">${priceNum}$</span>
            </div>

            <!-- Descripción -->
            <p class="text-slate-400 text-sm line-clamp-2 mb-4">
              ${post.description || 'Sin descripción disponible para esta página.'}
            </p>
          </div>

          <!-- Botón de Eliminar -->
          <div>
            <button class="btn-eliminar px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer">
              Eliminar
            </button>
          </div>
        </div>
      `;

      // Evento del botón de eliminar
      card.querySelector('.btn-eliminar').addEventListener('click', async () => {
        try {
          await axios.delete(`/api/Carrito/${postId}`);
          createNotificacion?.(false, 'Página eliminada del carrito');
          cargarCarrito(); 
        } catch (error) {
          console.error('Error al eliminar:', error);
          createNotificacion?.(true, 'No se pudo eliminar la página');
        }
      });

      cartContainer.appendChild(card);

      // 2. Item individual en la tarjeta de Resumen
      if (summaryContainer) {
        const itemRow = document.createElement('div');
        itemRow.className = 'flex justify-between items-center text-sm text-slate-300';
        itemRow.innerHTML = `
          <span class="truncate pr-2">${post.title}</span>
          <span class="font-semibold text-slate-200">${priceNum}$</span>
        `;
        summaryContainer.appendChild(itemRow);
      }
    });

    // Actualizar el Total Acumulado en el Resumen
    if (totalEl) totalEl.textContent = `${totalAcumulado}$`;

  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    cartContainer.innerHTML = `<p class="text-center py-8 text-red-400">Error al cargar las páginas agregadas.</p>`;
  }
};


