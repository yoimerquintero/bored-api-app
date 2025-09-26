require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

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
    version: '1.0.0'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Ruta de prueba BD: http://localhost:${PORT}/api/test-db`);
});