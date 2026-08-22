import createNotificacion from "../componentes/notificaciones.js";

export const templatesCreadas = async (containerId = 'shop-container') => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = `<p class="text-center col-span-full py-8 text-slate-400">Cargando publicaciones...</p>`;

    const { data: posts } = await axios.get('/api/CreateWeb');

    if (posts.length === 0) {
      container.innerHTML = `<p class="text-center col-span-full py-8 text-slate-400">No hay publicaciones disponibles.</p>`;
      return;
    }

    container.innerHTML = '';

    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between';

      card.innerHTML = `
        <div class="p-3 border-b border-slate-800 text-center font-semibold text-white truncate">
          ${post.title}
        </div>
        
        <div class="relative">
          <img src="${post.image || '/img/placeholder.png'}" alt="${post.title}" class="w-full h-36 object-cover">
        </div>

        <div class="p-3 text-center border-t border-slate-800">
          <span class="text-sm font-bold text-slate-300">Precio: $${post.price}</span>
        </div>

        <div class="p-3 bg-slate-950/50 flex items-center justify-between gap-2 border-t border-slate-800">
          <button class="btn-add-cart flex-1 py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors">
            Agregar
          </button>
          <button class="btn-details flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded transition-colors">
            Detalles
          </button>
        </div>
      `;

      // Eventos Corregidos
      const postId = post.id || post._id;
      card.querySelector('.btn-add-cart').addEventListener('click', () => agregarCarrito(postId));
      card.querySelector('.btn-details').addEventListener('click', () => vistaDetalles(post));

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar la tienda:', error);
    container.innerHTML = `<p class="text-center col-span-full py-8 text-red-400">Error al cargar las plantillas.</p>`;
  }
};

const agregarCarrito = async (webPostId) => {
  try {
    const { data } = await axios.put('/api/Carrito', { webPostId });
    
    createNotificacion?.(false, 'Producto añadido al carrito');
    return data;
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    createNotificacion?.(true, 'Hubo un error al agregar al carrito');
  }
};

const vistaDetalles = (post) => {
  document.getElementById('modal-details')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-details';
  modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4';

  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
      <div class="p-4 border-b border-slate-800 text-center font-bold text-lg text-white">
        Detalles
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
          <img src="${post.image || '/img/placeholder.png'}" alt="${post.title}" class="w-full h-full object-cover">
        </div>

        <div class="flex flex-col justify-between space-y-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-2">${post.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">${post.description || 'Sin descripción disponible.'}</p>
          </div>

          <div class="text-xl font-black text-cyan-400">
            Precio: $${post.price}
          </div>

          <div>
            <a href="${post.url || '#'}" target="_blank" class="w-full block text-center py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-colors">
              Visitar Página
            </a>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button id="modal-btn-add" class="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-lg transition-colors">
              Agregar
            </button>
            <button id="modal-btn-close" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-lg transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('modal-btn-close').addEventListener('click', () => modal.remove());
  
  // Evento corregido para agregar al carrito con el ID y cerrar el modal
  document.getElementById('modal-btn-add').addEventListener('click', async () => {
    const postId = post.id || post._id;
    await agregarCarrito(postId);
    modal.remove();
  });
};