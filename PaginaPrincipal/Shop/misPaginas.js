import createNotificacion from "../componentes/notificaciones.js";

export const renderizarMisPaginas = async (containerId = "mis-paginas-container") => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = `<p class="text-center col-span-full py-8 text-slate-400">Cargando tus compras...</p>`;

    // Solicitar las páginas compradas al backend
    const { data: misPaginas } = await axios.get('/api/MisPaginas');

    if (!misPaginas || misPaginas.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p class="text-slate-400 mb-4">Aún no has comprado ninguna plantilla.</p>
          <a href="/Web-Clientes" class="inline-block py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">
            Explorar Tienda
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    // Renderizar solo los productos que pertenecen a 'buys'
    misPaginas.forEach((pagina) => {
      const paginaId = pagina.id || pagina._id;
      const card = document.createElement('div');
      card.className = 'bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between';

      card.innerHTML = `
        <div class="p-3 border-b border-slate-800 text-center font-semibold text-white truncate">
          ${pagina.title}
        </div>
        
        <div class="relative">
          <img src="${pagina.image || '/img/placeholder.png'}" alt="${pagina.title}" class="w-full h-36 object-cover">
          <span class="absolute top-2 right-2 bg-emerald-500/90 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Adquirido
          </span>
        </div>

        <div class="p-3 bg-slate-950/50 flex items-center justify-between gap-2 border-t border-slate-800">
          <!-- Botón Ver Plantilla -->
          <a href="${pagina.url || '#'}" target="_blank" rel="noopener noreferrer"
             class="flex-1 text-center py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors">
            Ver Plantilla
          </a>

          <!-- Botón Contactar (exclusivo de páginas compradas) -->
          <button data-id="${paginaId}" data-title="${pagina.title}"
                  class="btn-contactar flex-1 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors flex items-center justify-center gap-1">
            Contactar
          </button>
        </div>
      `;

      // Evento para el botón Contactar
      const btnContactar = card.querySelector('.btn-contactar');
      btnContactar.addEventListener('click', () => {
        contactarSoporte(pagina);
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar Mis Paginas:', error);
    container.innerHTML = `<p class="text-center col-span-full py-8 text-red-400">Error al cargar tus páginas compradas.</p>`;
  }
};