const createNotificacion = (isError, message) => {
  // 1. Buscamos o creamos el contenedor principal de notificaciones (Toast Container)
  let container = document.querySelector('#notificacion-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificacion-container';
    // Posicionado fijo en la esquina superior derecha con z-index alto
    container.className = 'fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0';
    document.body.appendChild(container);
  }

  // 2. Creamos el elemento individual de la notificación
  const toast = document.createElement('div');
  
  // Estilos base: Glassmorphism oscuro, bordes finos, sombra con resplandor y animación
  const baseStyles = `
    pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md 
    shadow-2xl transition-all duration-300 ease-out transform translate-x-full opacity-0
  `;

  // Estilos temáticos según el estado (Error vs Éxito)
  const themeStyles = isError
    ? 'bg-slate-950/90 border-red-500/50 text-red-200 shadow-red-500/10'
    : 'bg-slate-950/90 border-cyan-500/50 text-cyan-200 shadow-cyan-500/10';

  const iconColor = isError ? 'text-red-400' : 'text-cyan-400';
  
  // Iconos SVG limpios en línea (sin dependencias externas)
  const iconSVG = isError
    ? `<svg class="w-6 h-6 ${iconColor} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    : `<svg class="w-6 h-6 ${iconColor} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.className = `${baseStyles} ${themeStyles}`;
  toast.innerHTML = `
    ${iconSVG}
    <div class="flex-1 text-sm font-medium tracking-wide">
      ${message}
    </div>
    <button class="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer p-1" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  // 3. Agregar al contenedor
  container.appendChild(toast);

  // 4. Animación de Entrada (Slide-in)
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  });

  // 5. Temporizador para Ocultar y Eliminar del DOM automáticamente (3.5 segundos)
  setTimeout(() => {
    // Animación de Salida (Slide-out)
    toast.classList.remove('translate-x-0', 'opacity-100');
    toast.classList.add('translate-x-full', 'opacity-0');

    // Remover el nodo HTML una vez que termine la transición de CSS
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3500);
};

export default createNotificacion;