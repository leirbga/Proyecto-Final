import createNotificacion from '../../PaginaPrincipal/componentes/notificaciones.js';

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api';

    const avatarLetra = document.getElementById('avatarLetra');
    const clienteNombreDisplay = document.getElementById('clienteNombreDisplay');
    const clienteEmailDisplay = document.getElementById('clienteEmailDisplay');
    const totalPedidos = document.getElementById('totalPedidos');
    const totalInvertido = document.getElementById('totalInvertido');
    const estadoCliente = document.getElementById('estadoCliente');
    
    const formPerfilCliente = document.getElementById('formPerfilCliente');
    const inputNombre = document.getElementById('inputNombre');
    const inputEmail = document.getElementById('inputEmail');
    const tablaHistorialBody = document.getElementById('tablaHistorialBody');

    const api = axios.create({
        baseURL: API_URL,
        withCredentials: true 
    });

    const renderizarHistorial = (compras) => {
        if (!compras || compras.length === 0) {
            tablaHistorialBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-4 py-6 text-center text-slate-500 text-xs">
                        No has realizado ninguna compra todavía.
                    </td>
                </tr>`;
            return;
        }

        tablaHistorialBody.innerHTML = compras.map((compra) => {
            const fecha = compra.purchasedAt 
                ? new Date(compra.purchasedAt).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })
                : 'Sin fecha';

            const titulo = compra.title || 'Sitio Web';
            const precio = Number(compra.pricePaid || 0).toFixed(2);

            return `
                <tr class="hover:bg-slate-900/40 transition-colors">
                    <td class="px-4 py-3 font-medium text-white">${titulo}</td>
                    <td class="px-4 py-3 text-slate-400">${fecha}</td>
                    <td class="px-4 py-3 text-slate-200 font-semibold">$${precio}</td>
                    <td class="px-4 py-3">
                        <span class="text-xs px-2.5 py-1 rounded-full border font-medium text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                            Completado
                        </span>
                    </td>
                </tr>`;
        }).join('');
    };

    const cargarPerfilYCompras = async () => {
        try {
            const res = await api.get('/users/profile');
            const user = res.data.user || res.data;

            const nombre = user.name || 'Cliente';
            const email = user.email || '';

            clienteNombreDisplay.textContent = nombre;
            clienteEmailDisplay.textContent = email;
            inputNombre.value = nombre;
            
            if (inputEmail) {
                inputEmail.value = email;
            }

            avatarLetra.textContent = nombre.charAt(0).toUpperCase();

            if (user.verified !== undefined) {
                estadoCliente.textContent = user.verified ? 'Verificado' : 'No verificado';
                estadoCliente.className = user.verified 
                    ? 'text-2xl font-bold text-emerald-400 mt-0.5' 
                    : 'text-2xl font-bold text-amber-400 mt-0.5';
            }

            const compras = user.buys || [];
            totalPedidos.textContent = compras.length;
            
            const sumaTotal = compras.reduce((acc, compra) => acc + Number(compra.pricePaid || 0), 0);
            totalInvertido.textContent = `$${sumaTotal.toFixed(2)}`;

            renderizarHistorial(compras);

        } catch (error) {
            console.error('Error al obtener perfil:', error);
            if (error.response && error.response.status === 401) {
                window.location.href = '/login';
            } else {
                createNotificacion(true, 'Error al cargar los datos del perfil.');
            }
        }
    };

    // Actualizar nombre con patch y notificaciones visuales
    formPerfilCliente.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoNombre = inputNombre.value.trim();

        if (!nuevoNombre) {
            createNotificacion(true, 'El nombre no puede estar vacío.');
            return;
        }

        try {
            await api.patch('/users/profile', { name: nuevoNombre });
            
            clienteNombreDisplay.textContent = nuevoNombre;
            avatarLetra.textContent = nuevoNombre.charAt(0).toUpperCase();

            // Notificación de éxito
            createNotificacion(false, 'Nombre actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el nombre:', error);
            
            // Notificación de error
            const mensajeError = error.response?.data?.message || 'Error al intentar actualizar el perfil.';
            createNotificacion(true, mensajeError);
        }
    });

    cargarPerfilYCompras();
});