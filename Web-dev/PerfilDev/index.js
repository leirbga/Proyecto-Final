import createNotificacion from "../../PaginaPrincipal/componentes/notificaciones.js";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Petición a la API (Asegúrate de que la URL coincida con la ruta de tu backend)
    const { data: user } = await axios.get('/api/users/profile');

    // Selección de elementos del DOM
    const devNombreHeader = document.querySelector('#devNombreHeader');
    const devIdHeader = document.querySelector('#devIdHeader');
    const badgeDev = document.querySelector('#badgeDev');
    
    const inputNombre = document.querySelector('#nombre');
    const inputEmail = document.querySelector('#email');
    const inputRol = document.querySelector('#rol');
    const inputFecha = document.querySelector('#fecha');

    // Inyección de valores básicos
    if (devNombreHeader) devNombreHeader.textContent = user.name || 'Sin Nombre';
    if (devIdHeader) devIdHeader.textContent = user.id ? `#${user.id.slice(-6).toUpperCase()}` : '#N/A';
    
    if (inputNombre) inputNombre.value = user.name || '';
    if (inputEmail) inputEmail.value = user.email || '';
    if (inputFecha) inputFecha.value = user.joinedAt || user.createdAt?.split('T')[0] || 'N/A';

    // Manejo dinámico según la propiedad dev (true/false)
    if (user.dev) {
      if (inputRol) inputRol.value = 'Developer';
      if (badgeDev) {
        badgeDev.textContent = 'Dev';
        badgeDev.className = 'px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
      }
    } else {
      if (inputRol) inputRol.value = 'Cliente';
      if (badgeDev) {
        badgeDev.textContent = 'Cliente';
        badgeDev.className = 'px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700';
      }
    }

  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    if (typeof createNotificacion === 'function') {
      createNotificacion(true, 'Error al obtener la información del perfil');
    }
  }
});