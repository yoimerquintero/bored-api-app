// server.js
import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';

import sequelize, { testConnection } from './config/database.js'; // 👈 importa sequelize
import { UsuarioRoutes, ActividadRoutes, FavoritoRoutes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------- Middlewares -------------------
app.use(cors());
app.use(json());

// ------------------- Rutas -------------------
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/actividades', ActividadRoutes);
app.use('/api/favoritos', FavoritoRoutes);

// Ruta de prueba de conexión a la BD
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ message: '✅ Base de datos conectada correctamente' });
  } else {
    res.status(500).json({ error: '❌ Error de conexión a la base de datos' });
  }
});

// Ruta básica de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: '🚀 Bored API Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      testDb: '/api/test-db',
      actividades: '/api/actividades',
      usuarios: '/api/usuarios',
      favoritos: '/api/favoritos'
    }
  });
});

// ------------------- Iniciar servidor -------------------
app.listen(PORT, async () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();

  try {
    await sequelize.sync({ alter: true }); // 👈 sincroniza modelos con la BD
    console.log('✅ Tablas creadas/sincronizadas en la BD');
  } catch (error) {
    console.error('❌ Error al sincronizar las tablas:', error);
  }
});

export default app;
