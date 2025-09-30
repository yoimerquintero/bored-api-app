// server.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const sequelize = require('./config/database');
const { User, Activity, Favorite } = require('./models');
const { authRoutes, activityRoutes, favoriteRoutes } = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); 
    console.log('✅ Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
  }
};

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/favorites', favoriteRoutes);

// Ruta de prueba de conexión a la BD
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

// Ruta principal de la API
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 Bored API Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        verify: 'GET /api/auth/verify'
      },
      activities: {
        random: 'GET /api/activities/random',
        all: 'GET /api/activities',
        types: 'GET /api/activities/types',
        search: 'GET /api/activities/search',
        byKey: 'GET /api/activities/:key'
      },
      favorites: {
        list: 'GET /api/favorites',
        add: 'POST /api/favorites',
        toggle: 'POST /api/favorites/toggle',
        remove: 'DELETE /api/favorites/:actividad_key',
        check: 'GET /api/favorites/check/:actividad_key',
        stats: 'GET /api/favorites/stats'
      }
    },
    documentation: 'Consulta el README para más información'
  });
});

// Ruta de bienvenida (raíz)
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

// Iniciar servidor y sincronizar BD
const startServer = async () => {
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Ruta de prueba BD: http://localhost:${PORT}/api/test-db`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api`);
  });
};

startServer();

module.exports = app;
