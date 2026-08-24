import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// IMPORTACIÓN DE CONTROLADORES
import usersRouter from './PaginaPrincipal/back/controllers/userVerify.js';
import loginRouter from './PaginaPrincipal/back/controllers/login.js';
import createWebRouter from './PaginaPrincipal/back/controllers/createWebRouter.js';
import logoutRouter from './PaginaPrincipal/back/controllers/logout.js';
import carritoRouter from './PaginaPrincipal/back/controllers/carritoRouter.js';

// 💡 IMPORTACIÓN DE MIDDLEWARES UNIFICADOS
import { userExtractor, isDev } from './middleware/auth.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================
app.use(cors());
app.use(cookieParser());
app.use(morgan('tiny'));

// Soporte para imágenes Base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// ==========================================
// RUTAS BACKEND (API REST)
// ==========================================
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use('/api/CreateWeb', userExtractor, createWebRouter);
app.use('/api/Carrito', userExtractor, carritoRouter);

// Logout
app.use('/api/logout', logoutRouter);


// ==========================================
// RUTAS PROTEGIDAS (HTML Y VISTAS PRIVADAS)
// ==========================================

// Para acceder a Web-Dev, ejecutamos userExtractor primero para poblar req.user y luego isDev para verificar el rol
app.get('/Web-dev', userExtractor, isDev, (req, res) => {
  res.sendFile(path.join(__dirname, 'Web-Dev', 'index.html')); 
});

app.use('/Web-Dev', userExtractor, isDev, express.static(path.join(__dirname, 'Web-Dev')));

// Vista protegida para Web-Clientes (requiere iniciar sesión)
app.use('/Web-Clientes', userExtractor, express.static(path.join(__dirname, 'Web-Clientes')));


// ==========================================
// ARCHIVOS ESTÁTICOS PÚBLICOS
// ==========================================
app.use('/', express.static(path.join(__dirname, 'PaginaPrincipal')));
app.use('/PaginaPrincipal', express.static(path.join(__dirname, 'PaginaPrincipal')));
app.use('/registro', express.static(path.join(__dirname, 'registro')));
app.use('/login', express.static(path.join(__dirname, 'login')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/componentes', express.static(path.join(__dirname, 'componentes')));
app.use('/MisPaginas', express.static(path.join(__dirname, 'MisPaginas')));
app.use('/Carrito', express.static(path.join(__dirname, 'Carrito')));


// ==========================================
// CONEXIÓN A LA BASE DE DATOS Y SERVIDOR
// ==========================================
(async () => {
  try {
    const PORT = process.env.PORT || 3003;
    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log('Conectado exitosamente a MONGODB');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log("Error de conexión:", error);
  }
})();

export default app;