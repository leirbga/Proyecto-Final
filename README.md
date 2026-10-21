🚀 WebCraft - Plataforma E-Commerce y Gestión Web

WebCraft es una aplicación web full-stack, segura y responsiva diseñada para ofrecer una experiencia fluida tanto a clientes como a desarrolladores. La plataforma cuenta con control de acceso basado en roles (RBAC), autenticación JWT mediante cookies httpOnly, interfaz de pagos dinámica y una arquitectura limpia que separa rutas de API de vistas HTML, optimizada para su despliegue en Render.

🛠️ Tecnologías Utilizadas

Backend

Node.js: Entorno de ejecución de JavaScript en el servidor.

Express.js: Framework para la creación de la API REST y el servidor de archivos estáticos.

MongoDB & Mongoose: Base de datos NoSQL y ODM para el modelado de datos.

JSON Web Tokens (JWT): Manejo seguro de sesiones de usuario almacenados en cookies httpOnly.

Bcrypt: Encriptación y verificación segura de contraseñas.

Cookie-Parser: Middleware para la lectura y gestión de cookies en peticiones HTTP.

CORS & Morgan: Control de acceso de origen cruzado y registro de solicitudes HTTP en consola.

Dotenv: Gestión de variables de entorno mediante archivos .env.

Frontend

HTML5 & CSS3: Estructura semántica y diseño de interfaces.

Tailwind CSS: Framework de CSS basado en clases de utilidad para interfaces responsivas.

JavaScript (ES6+): Lógica del cliente, manipulación del DOM y eventos.

Axios / Fetch API: Peticiones HTTP asíncronas desde el cliente hacia el servidor.

✨ Características Principales

Autenticación Segura con JWT:

Registro e inicio de sesión con cifrado de contraseñas mediante bcrypt.

Manejo de sesiones con tokens guardados en cookies de tipo httpOnly (accessToken), previniendo ataques de tipo XSS.

Control de Acceso Basado en Roles (RBAC):

Zona de Clientes (/Web-Clientes): Entorno protegido para usuarios autenticados orientado a la exploración del catálogo, gestión del carrito y procesamiento de pedidos.

Panel de Desarrolladores (/Web-Dev): Portal exclusivo restringido a usuarios con permisos de desarrollador (dev) para la administración del sistema.

Pasarela de Pagos Dinámica e Interactiva:

Interfaz interactiva compatible con Tarjeta de Crédito y PayPal.

Validación del lado del cliente sincronizada que activa o desactiva la obligatoriedad de los campos (required) según el método seleccionado.

Arquitectura de Middlewares Duales:

Middlewares para API (userExtractor, isDev): Protegen las rutas REST devolviendo respuestas estructuradas en formato JSON (401, 403).

Middlewares para Vistas (userExtractorView, isDevView): Protegen las vistas HTML completas redirigiendo a los usuarios no autorizados a la página centralizada /error/.

Navegación Fluida (Smooth Scroll):

Enlaces de anclaje interno (#acerca-de, #contacto) integrados con desplazamiento suave en la página principal.

📁 Estructura del Proyecto

├── componentes/         # Componentes de interfaz reutilizables
├── img/                 # Recursos gráficos e imágenes estáticas
├── login/               # Recursos visuales y scripts del Login
├── registro/            # Recursos visuales y scripts del Registro
├── Carrito/             # Vista y scripts del Carrito de compras
├── MisPaginas/          # Vista para la gestión de proyectos de usuario
├── PaginaPrincipal/     # Landing page principal y plantillas
│   ├── back/            # Controladores y modelos del backend
│   │   ├── controllers/ # Rutas Express (login, usuarios, carrito, etc.)
│   │   └── models/      # Esquemas de Mongoose (User, WebPost, etc.)
│   └── error/           # Vista centralizada de errores
├── Web-Clientes/        # Panel y tienda para clientes autenticados
├── Web-Dev/             # Panel exclusivo de administración para desarrolladores
├── middleware/          # Middlewares de autenticación y autorización
├── app.js               # Punto de entrada principal de la aplicación Express
├── .env                 # Variables de entorno (excluido en git)
└── package.json         # Dependencias y scripts del proyecto


⚙️ Variables de Entorno

Crea un archivo .env en la raíz del proyecto y configura las siguientes variables:

PORT=3003
MONGO_URI_TEST=tu_cadena_de_conexion_a_mongodb
ACCESS_TOKEN_SECRET=tu_clave_secreta_para_jwt
NODE_ENV=production


🚀 Instalación y Configuración Local

Requisitos Previos

Node.js (versión 16 o superior recomendada).

Instancia de MongoDB (local o MongoDB Atlas).

Pasos

Clonar el repositorio:

git clone https://github.com/tu-usuario/webcraft.git
cd webcraft


Instalar dependencias:

npm install


Iniciar el servidor en desarrollo:

npm start


Abre tu navegador e ingresa a http://localhost:3003.

☁️ Notas sobre el Despliegue en Producción (Render)

Sensibilidad a Mayúsculas y Minúsculas (Case-Sensitivity en Linux): Render ejecuta el código en un entorno Linux, el cual distingue estrictamente entre mayúsculas y minúsculas en rutas de archivos y carpetas (por ejemplo, /Web-Dev es diferente de /Web-dev). Es imprescindible que los nombres de las carpetas coincidan exactamente con las rutas definidas en app.js y en las redirecciones del frontend.

Configuración de Cookies: En el entorno de producción, asegúrate de mantener secure: process.env.NODE_ENV === 'production' y evaluar la política sameSite ('lax' o 'strict') para garantizar que el navegador transmita la cookie accessToken correctamente entre vistas y solicitudes asíncronas.