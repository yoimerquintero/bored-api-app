require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { User, Activity, Favorite } = require('./models'); // <-- importar modelos

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Función para sincronizar modelos
const syncDatabase = async () => {
  try {
    await testConnection();
    await Favorite.sync({ force: false }); // force: true solo en desarrollo
    console.log(' Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error(' Error al sincronizar modelos:', error);
  }
};

// Ruta de prueba de conexión a la BD
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ message: ' Base de datos conectada correctamente' });
  } else {
    res.status(500).json({ error: ' Error de conexión a la base de datos' });
  }
});

// Ruta básica de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: ' Bored API Backend funcionando!',
    version: '1.0.0',
    endpoints: {
      testDb: '/api/test-db',
      activities: '/api/activities',
      users: '/api/users'
    }
  });
});

// Iniciar servidor y sincronizar BD
app.listen(PORT, async () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  await syncDatabase(); // <-- sincronizar al arrancar
});
