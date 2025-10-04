import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Para usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ IMPORTACIÓN CORREGIDA - sequelize es export default
import sequelize, { testConnection } from './config/database.js';

// Importar rutas - verifica que también usen export default
import UsuarioRoutes from './routes/UsuarioRoutes.js';
import ActividadRoutes from './routes/ActividadRoutes.js';
import FavoritoRoutes from './routes/FavoritoRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------- Middlewares -------------------
app.use(cors());
app.use(json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// ------------------- Rutas de la API -------------------
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/actividades', ActividadRoutes);
app.use('/api/favoritos', FavoritoRoutes);

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

// Ruta básica de la API
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 Bored API Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      testDb: '/api/test-db',
      actividades: '/api/actividades',
      usuarios: '/api/usuarios',
      favoritos: '/api/favoritos',
      web: '/'
    }
  });
});

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({
      success: false,
      error: 'Ruta de API no encontrada',
      suggestion: 'Visita /api para ver los endpoints disponibles'
    });
  } else {
    res.redirect('/');
  }
});

// ------------------- Iniciar servidor -------------------
app.listen(PORT, async () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Interfaz web disponible en: http://localhost:${PORT}`);
  console.log(`🔧 API disponible en: http://localhost:${PORT}/api`);
  
  await testConnection();

  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas creadas/sincronizadas en la BD');
  } catch (error) {
    console.error('❌ Error al sincronizar las tablas:', error);
  }
});

export default app;