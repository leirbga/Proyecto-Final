export const templatesCreadas = async (containerId = 'shop-container') =>{
  
const container = document.getElementById(containerId);

  if (!container) {
    console.error(`No se encontró el contenedor HTML con id "${containerId}"`);
    return;
  }

  try {
    container.innerHTML = `<p class="text-center py-8 text-gray-400">Cargando publicaciones...</p>`;

    const { data: posts } = await axios.get('/api/CreateWeb');

    if (posts.length === 0) {
      container.innerHTML = `<p class="text-center py-8 text-gray-400">No hay publicaciones disponibles.</p>`;
      return;
    }

    container.innerHTML = '';

    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'card-template bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-all duration-300';

      card.innerHTML = `
        <div class="relative">
          <img src="${post.image || '/img/placeholder.png'}" alt="${post.title}" class="w-full h-48 object-cover">
          <span class="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            ${post.theme || 'General'}
          </span>
        </div>
        
        <div class="p-5 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-white mb-2">${post.title}</h3>
            <p class="text-slate-400 text-sm line-clamp-3 mb-4">${post.description}</p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
            <span class="text-2xl font-black text-cyan-400">$${post.price}</span>
            <a href="${post.url || '#'}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-lg transition-colors">
              Ver Demo
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar la tienda:', error);
    container.innerHTML = `<p class="text-center py-8 text-red-400">Error al cargar las plantillas de MongoDB.</p>`;
  }
};