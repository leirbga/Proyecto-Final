import createNotificacion from "../componentes/notificaciones.js";
import { renderizarTarjetas } from "./shop.js";

// Helper para limpiar el teléfono de WhatsApp
const formatearTelefono = (phone) => {
  if (!phone) return "";
  return phone.toString().replace(/[^0-9]/g, "");
};

// =======================================================
// MÓDULO CLIENTE: Páginas que el usuario COMPRÓ
// =======================================================
export const renderizarMisComprasCliente = async (containerId = "mis-paginas-container") => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = `<p class="text-center col-span-full py-8 text-slate-400">Cargando tus compras...</p>`;

    // Petición enviando credenciales/cookies
    const { data: misPaginas } = await axios.get('/api/users/mis-compras', {
      withCredentials: true
    });

    if (!misPaginas || misPaginas.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p class="text-slate-400 mb-4">Aún no has adquirido ninguna plantilla.</p>
          <a href="/Web-Clientes" class="inline-block py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">
            Explorar Tienda
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    misPaginas.forEach((pagina) => {
      const card = document.createElement('div');
      card.className = 'bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between';

      // Normalizar número de teléfono para WhatsApp
      const rawPhone = pagina.whatsappCreator || pagina.whatsapp || "";
      const phoneLimpio = formatearTelefono(rawPhone);
      const wsMessage = encodeURIComponent(`Hola! Compré la plantilla "${pagina.title}" en WebCraft y necesito soporte.`);
      const wsUrl = phoneLimpio ? `https://wa.me/${phoneLimpio}?text=${wsMessage}` : null;

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
          <a href="${pagina.url || '#'}" target="_blank" rel="noopener noreferrer"
             class="flex-1 text-center py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-colors">
            Ver Plantilla
          </a>

          ${wsUrl ? `
            <a href="${wsUrl}" target="_blank" rel="noopener noreferrer"
               class="flex-1 text-center py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors">
              Contactar
            </a>
          ` : `
            <button disabled title="Sin WhatsApp registrado"
                    class="flex-1 text-center py-1.5 px-3 bg-slate-800 text-slate-500 font-bold text-xs rounded cursor-not-allowed">
              Sin Contacto
            </button>
          `}
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar compras del cliente:', error);
    container.innerHTML = `<p class="text-center col-span-full py-8 text-red-400">Error al cargar tus páginas adquiridas.</p>`;
  }
};

// =======================================================
// MÓDULO CREADOR/DEV: Templates que el usuario SUBIÓ
// =======================================================
// =======================================================
// MÓDULO CREADOR / DEV
// =======================================================
export const cargarMisPaginasDev = async (containerId = "shop-container") => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = `<p class="text-center col-span-full py-8 text-slate-400">Cargando tus publicaciones...</p>`;

    const { data } = await axios.get('/api/CreateWeb/MisPaginas');
    const posts = data.posts || [];

    if (!posts || posts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p class="text-slate-400 text-lg mb-4">Aún no has subido ninguna plantilla.</p>
          <a href="/Web-dev/WebCreate" class="inline-block py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors">
            Subir mi primer Template
          </a>
        </div>
      `;
      return;
    }

    renderizarTarjetasDev(posts, container);

  } catch (error) {
    console.error("Error al cargar templates creados:", error);
    createNotificacion?.(true, "Error al obtener tus publicaciones");
    container.innerHTML = `<p class="text-center col-span-full py-8 text-red-400">Error al cargar tus plantillas.</p>`;
  }
};

// Renderizado con diseño Horizontal tipo Maqueta
const renderizarTarjetasDev = (posts, container) => {
  container.innerHTML = '';
  // CSS Grid: 1 columna en pantallas pequeñas, 2 columnas a partir del breakpoint 'xl'
  container.className = "grid grid-cols-1 xl:grid-cols-2 gap-4 w-full items-start";

  posts.forEach((post) => {
    const postId = post.id || post._id;
    const ventasCount = Array.isArray(post.buyers) ? post.buyers.length : 0;
    const vistasCount = post.views || 0;

    const row = document.createElement('div');
    // Se remueve max-w-3xl para que la tarjeta se adapte perfectamente a la columna del grid
    row.className = "w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row items-stretch justify-between p-3 gap-4";

    row.innerHTML = `
      <!-- Sección de Imagen (Izquierda) -->
      <div class="w-full md:w-48 h-32 flex-shrink-0 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative">
        <img src="${post.image || '/img/placeholder.png'}" alt="${post.title}" class="w-full h-full object-cover">
      </div>

      <!-- Sección Central y Botones -->
      <div class="flex-1 flex flex-col justify-between py-1 space-y-3">
        <div>
          <h3 class="text-lg font-bold text-white truncate">${post.title}</h3>
          <p class="text-xs text-slate-400 font-semibold">Precio: $${post.price}</p>
        </div>

        <!-- Fila de Botones del Maquetado: VER | EDITAR | VISTAS | COMPRAS -->
        <div class="flex flex-wrap items-center gap-2">
          <button class="btn-ver py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg border border-slate-700 transition-colors">
            VER
          </button>
          
          <button class="btn-editar py-1.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors">
            EDITAR
          </button>

          <div class="py-1.5 px-3 bg-slate-950 text-slate-300 font-medium text-xs rounded-lg border border-slate-800">
            👁️ Vistas: <span class="font-bold text-cyan-400">${vistasCount}</span>
          </div>

          <div class="py-1.5 px-3 bg-slate-950 text-slate-300 font-medium text-xs rounded-lg border border-slate-800">
            🛒 Vendidos: <span class="font-bold text-emerald-400">${ventasCount}</span>
          </div>
        </div>
      </div>

      <!-- Sección Derecha: Eliminar -->
      <div class="flex md:flex-col items-center justify-end md:justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
        <button class="btn-eliminar py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-lg transition-colors">
          Eliminar
        </button>
      </div>
    `;

    // Evento VER
    row.querySelector('.btn-ver').addEventListener('click', () => abrirModalVerDev(post));

    // Evento EDITAR
    row.querySelector('.btn-editar').addEventListener('click', () => abrirModalEditarDev(post, container));

    // Evento ELIMINAR
    row.querySelector('.btn-eliminar').addEventListener('click', () => eliminarPostDev(postId, container));

    container.appendChild(row);
  });
};
// =======================================================
// MODALES Y ACCIONES
// =======================================================

// 1. Modal VER (Sin incremento de contador)
const abrirModalVerDev = (post) => {
  document.getElementById("modal-dev-preview")?.remove();

  const ventasCount = Array.isArray(post.buyers) ? post.buyers.length : 0;
  const vistasCount = post.views || 0;
  const telefono = post.whatsappCreator || post.whatsapp || "No registrado";

  const modal = document.createElement("div");
  modal.id = "modal-dev-preview";
  modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-xl font-bold text-white">${post.title}</h3>
        <span class="text-xs bg-slate-800 text-cyan-400 font-semibold px-2.5 py-1 rounded-full border border-slate-700">
          ID: ${post._id || post.id}
        </span>
      </div>
      
      <div class="h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
        <img src="${post.image || '/img/placeholder.png'}" class="w-full h-full object-cover">
      </div>

      <div class="space-y-2 text-sm">
        <p class="text-slate-300"><strong class="text-slate-400">Descripción:</strong> ${post.description || "Sin descripción."}</p>
        <p class="text-slate-300"><strong class="text-slate-400">Precio:</strong> <span class="text-emerald-400 font-bold">$${post.price}</span></p>
        <p class="text-slate-300"><strong class="text-slate-400">Categoría:</strong> ${post.theme}</p>
        <p class="text-slate-300"><strong class="text-slate-400">Teléfono / WhatsApp:</strong> ${telefono}</p>
        <p class="text-slate-300"><strong class="text-slate-400">Enlace:</strong> <a href="${post.url}" target="_blank" class="text-cyan-400 underline truncate block">${post.url}</a></p>
      </div>

      <!-- Estadísticas de la publicación -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
          <span class="block text-xs text-slate-400">Vistas Totales</span>
          <span class="text-lg font-bold text-cyan-400">👁️ ${vistasCount}</span>
        </div>
        <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
          <span class="block text-xs text-slate-400">Total Compras</span>
          <span class="text-lg font-bold text-emerald-400">🛒 ${ventasCount}</span>
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-2">
        <a href="${post.url}" target="_blank" class="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors">Visitar Enlace</a>
        <button id="close-modal-ver" class="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors">Cerrar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("close-modal-ver").addEventListener("click", () => modal.remove());
};

// 2. Modal EDITAR (Permite modificar Título, Precio, Teléfono, Categoría, URL y Descripción)
const abrirModalEditarDev = (post, container) => {
  document.getElementById("modal-dev-edit")?.remove();

  const telefonoActual = post.whatsappCreator || post.whatsapp || "";
  const categoriaActual = (post.theme || "tecnologia").toLowerCase();

  const modal = document.createElement("div");
  modal.id = "modal-dev-edit";
  modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
      <h3 class="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Editar Plantilla</h3>

      <form id="form-edit-template" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Título</label>
          <input type="text" id="edit-title" value="${post.title}" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" required>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Precio ($)</label>
            <input type="number" id="edit-price" value="${post.price}" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" required>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">WhatsApp / Contacto</label>
            <input type="text" id="edit-phone" value="${telefonoActual}" placeholder="+58412..." class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Categoría / Temática</label>
          <select id="edit-theme" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" required>
            <option value="tecnologia" ${categoriaActual === 'tecnologia' ? 'selected' : ''} class="bg-slate-900 text-slate-200">Tecnología</option>
            <option value="restaurantes" ${categoriaActual === 'restaurantes' ? 'selected' : ''} class="bg-slate-900 text-slate-200">Restaurantes</option>
            <option value="ecommerce" ${categoriaActual === 'ecommerce' ? 'selected' : ''} class="bg-slate-900 text-slate-200">Moda / Ecommerce</option>
            <option value="blogs" ${categoriaActual === 'blogs' ? 'selected' : ''} class="bg-slate-900 text-slate-200">Blogs Personales</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">URL de la web</label>
          <input type="url" id="edit-url" value="${post.url}" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" required>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Descripción</label>
          <textarea id="edit-description" rows="3" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-cyan-500" required>${post.description || ''}</textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="close-modal-edit" class="py-2 px-4 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancelar</button>
          <button type="submit" class="py-2 px-4 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg">Guardar Cambios</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("close-modal-edit").addEventListener("click", () => modal.remove());

  document.getElementById("form-edit-template").addEventListener("submit", async (e) => {
    e.preventDefault();
    const postId = post.id || post._id;

    try {
      await axios.put(`/api/CreateWeb/${postId}`, {
        title: document.getElementById("edit-title").value,
        price: document.getElementById("edit-price").value,
        whatsappCreator: document.getElementById("edit-phone").value,
        theme: document.getElementById("edit-theme").value,
        url: document.getElementById("edit-url").value,
        description: document.getElementById("edit-description").value
      });

      createNotificacion?.(false, "Plantilla actualizada correctamente");
      modal.remove();
      cargarMisPaginasDev(container.id);
    } catch (error) {
      console.error("Error al actualizar la plantilla:", error);
      createNotificacion?.(true, "Error al guardar los cambios");
    }
  });
};

// 3. Acción ELIMINAR
const eliminarPostDev = async (postId, container) => {
  if (!confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) return;

  try {
    await axios.delete(`/api/CreateWeb/${postId}`);
    createNotificacion?.(false, "Plantilla eliminada");
    cargarMisPaginasDev(container.id);
  } catch (error) {
    console.error("Error al eliminar post:", error);
    createNotificacion?.(true, "Error al eliminar la plantilla");
  }
};