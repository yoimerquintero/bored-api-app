// server.js
import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';

// Configuración de la base de datos
import { testConnection, sync } from './config/database.js';

// Rutas centralizadas
import { UsuarioRoutes, ActividadRoutes, FavoritoRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------- Middlewares -------------------
app.use(cors());
app.use(json());

// ------------------- Sincronizar BD -------------------
const syncDatabase = async () => {
  try {
    await testConnection();
    await sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
  }
};

// ------------------- Rutas -------------------
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/actividades', ActividadRoutes);
app.use('/api/favoritos', FavoritoRoutes);

// Ruta de prueba BD
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({
      success: true,
      message: '✅ Base de datos conectada correctamente'
    });
  } else {
    res.status(500).json({
      success: false,
      error: '❌ Error de conexión a la base de datos'
    });
  }
});

// Ruta principal API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Bored API Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/usuarios/registrar',
        login: 'POST /api/usuarios/iniciar-sesion',
        profile: 'GET /api/usuarios/perfil',
        verify: 'GET /api/usuarios/verificar'
      },
      activities: {
        random: 'GET /api/actividades/aleatoria',
        all: 'GET /api/actividades',
        types: 'GET /api/actividades/tipos',
        search: 'GET /api/actividades/buscar',
        byKey: 'GET /api/actividades/:clave'
      },
      favorites: {
        list: 'GET /api/favoritos',
        add: 'POST /api/favoritos',
        toggle: 'POST /api/favoritos/alternar',
        remove: 'DELETE /api/favoritos/:actividad_key',
        check: 'GET /api/favoritos/verificar/:actividad_key',
        stats: 'GET /api/favoritos/estadisticas'
      }
    }
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la Bored API',
    redirect: 'Visita /api para ver los endpoints disponibles'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    suggestion: 'Visita /api para ver los endpoints disponibles'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// ------------------- Iniciar servidor -------------------
const startServer = async () => {
  await syncDatabase();
  app.listen(PORT, () => {
    console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Ruta prueba BD: http://localhost:${PORT}/api/test-db`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;
