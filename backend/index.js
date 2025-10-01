require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Puerto desde .env o 3001 por defecto
const PORT = process.env.PORT || 3001;

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor backend funcionando con Express',
    version: '1.0.0'
  });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
