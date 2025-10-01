const { testConnection } = require('./config/database');

const ejecutar = async () => {
  const conectado = await testConnection();
  if (conectado) {
    console.log('🎉 ¡Todo listo para usar la base de datos!');
  } else {
    console.log('⚠️ No se pudo conectar a la base de datos.');
  }
};

ejecutar();
