import createNotificacion from "./notificaciones.js";

const navBar = document.querySelector('#navBar');
const tematica = document.querySelector('#tematica');

const fondoBody = () => {
    const bodyFondo = document.querySelector('#bodyFondo');
    if (bodyFondo) bodyFondo.classList.add('bg-slate-950');
};

const navHome = () => {
    navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <!-- Menu Principal-->
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
            WebCraft
            </a>

            <!-- Enlaces de Navegación -->
            <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <a href="#" class="hover:text-cyan-400 transition-colors">Inicio</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Acerca de</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Contacto</a>
            </div>
        </div>

        <!-- Botón / Login -->
        <div class="flex items-center gap-4">
            <a href="/front/login" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Iniciar Sesión
            </a>
            <a href="/front/registro" class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-cyan-500/20 transition-all">
                Registrarse
            </a>
        </div>
    </div>`;
};

const NavRegistro = () => {
    navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
            WebCraft
            </a>

            <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <a href="/" class="hover:text-cyan-400 transition-colors">Inicio</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Acerca de</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Contacto</a>
            </div>
        </div>
    </div>`;
};

const NavLogin = () => {
    navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
            WebCraft
            </a>

            <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <a href="/" class="hover:text-cyan-400 transition-colors">Inicio</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Acerca de</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Contacto</a>
            </div>
        </div>
    </div>`;
};

const NavClientes = () => {
  navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <!-- Logo / Nombre -->
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
                WebCraft
            </a>
        </div>

        <!-- Acciones: Carrito + Cerrar Sesión -->
        <div class="flex items-center gap-6 text-sm font-medium text-slate-300 ml-auto">
            
            <!-- Botón de Redirección Directa al Carrito -->
            <a href="/Web-Clientes/Carrito" id="btn-carrito" class="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all cursor-pointer">
                <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                <span>Ver Carrito</span>
            </a>

            <!-- Botón Cerrar Sesión -->
            <button id="closeSesion" class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>`;

  // Lógica de Cerrar Sesión
  const btnCloseSesion = document.querySelector('#closeSesion');
  if (btnCloseSesion) {
    btnCloseSesion.addEventListener('click', async () => {
      try {
        await axios.post('/api/logout');
        createNotificacion(false, 'Sesión cerrada correctamente');

        setTimeout(() => {
          window.location.href = '/front/login';
        }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        createNotificacion(true, 'Hubo un problema al cerrar la sesión');
      }
    });
  }
};

const NavDev = () => {
  navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <!-- Logo / Nombre -->
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
                WebCraft <span class="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">Dev</span>
            </a>
        </div>

        <div class="flex items-center gap-6 text-sm font-medium text-slate-300 ml-auto">
            <!-- Botón Cerrar Sesión -->
            <button id="closeSesionDev" class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>`;

  const btnCloseSesion = document.querySelector('#closeSesionDev');
  if (btnCloseSesion) {
    btnCloseSesion.addEventListener('click', async () => {
      try {
        await axios.post('/api/logout');
        createNotificacion(false, 'Sesión de desarrollador cerrada');

        setTimeout(() => {
          window.location.href = '/front/login';
        }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        createNotificacion(true, 'Hubo un problema al cerrar la sesión');
      }
    });
  }
};

const Tematicas = () => {
  if (tematica) {
    tematica.innerHTML = ` 
      <select id="select-tematica" required
        class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500 transition-all text-sm cursor-pointer">
        <option value="" disabled selected>Ingrese la temática</option>
        <option value="tecnologia">Tecnología</option>
        <option value="restaurantes">Restaurantes</option>
        <option value="ecommerce">Ecommerce / Tienda</option>
        <option value="blog">Blog Personal</option>
      </select>`;
  }
};

const NavUserLogin = () =>{

navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <!-- Menu Principal-->
        <div class="flex items-center gap-8">
            <a href="/" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
            WebCraft <span class="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">Dev</span>
            </a>

            <!-- Enlaces de Navegación -->
            <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <a href="#" class="hover:text-cyan-400 transition-colors">Inicio</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Acerca de</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Contacto</a>
            </div>
        </div>
    <div class="flex items-center gap-6 text-sm font-medium text-slate-300 ml-auto">
            <!-- Botón Cerrar Sesión -->
            <button id="closeSesionDev" class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>`;

     const btnCloseSesion = document.querySelector('#closeSesionDev');
  if (btnCloseSesion) {
    btnCloseSesion.addEventListener('click', async () => {
      try {
        await axios.post('/api/logout');
        createNotificacion(false, 'Sesión de desarrollador cerrada');

        setTimeout(() => {
          window.location.href = '/front/login';
        }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        createNotificacion(true, 'Hubo un problema al cerrar la sesión');
      }
    });
  }
};

const NavCarrito = () => {
  const navBar = document.getElementById('navBar');
  if (!navBar) return;

  navBar.innerHTML = `
    <div class="max-w-7xl h-full mx-auto flex items-center justify-between px-6">        
        <!-- Logo / Nombre -->
        <div class="flex items-center gap-8">
            <a href="/Web-Clientes" class="text-xl font-bold text-cyan-400 tracking-wide flex items-center gap-2">
                WebCraft
            </a>
        </div>

        <!-- Acciones: Volver Atrás + Cerrar Sesión -->
        <div class="flex items-center gap-6 text-sm font-medium text-slate-300 ml-auto">
            
            <!-- Botón Volver Atrás Estilizado -->
            <a href="/Web-Clientes" id="btn-back" class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/30 transition-all shadow-sm">
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span>Volver atrás</span>
            </a>

            <!-- Botón Cerrar Sesión -->
            <button id="closeSesion" class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    </div>`;

  // Lógica de Cerrar Sesión
  const btnCloseSesion = document.querySelector('#closeSesion');
  if (btnCloseSesion) {
    btnCloseSesion.addEventListener('click', async () => {
      try {
        await axios.post('/api/logout');
        createNotificacion(false, 'Sesión cerrada correctamente');

        setTimeout(() => {
          window.location.href = '/front/login';
        }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        createNotificacion(true, 'Hubo un problema al cerrar la sesión');
      }
    });
  }
};

const path = window.location.pathname;

if (path === '/' || path === '/index.html') {
    navHome(); 
} else if (path.includes('/registro')) {
    NavRegistro(); 
    fondoBody();
} else if (path.includes('/login')) {
    NavLogin(); 
    fondoBody();
}else if (path.includes('/Web-Clientes/Carrito')){
    NavCarrito();
}else if (path.includes('/Web-Clientes')) {
    NavClientes(); 
    Tematicas();
}else if (path.includes('/Web-dev') || path.includes('/Web-Dev')) {
    NavDev(); 
    Tematicas();
}