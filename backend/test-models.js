const { sequelize, testConnection } = require('./config/database');
const { Usuario, Actividad, Favorito } = require('./models');

async function run() {
  await testConnection();
  // En desarrollo: sincroniza tablas (usa { force: true } solo si quieres borrar tablas)
  await sequelize.sync({ alter: true });
  console.log('Tablas sincronizadas');

  // Creación de ejemplo (opcional)
  const [usuario] = await Usuario.findOrCreate({
    where: { correo: 'demo@example.com' },
    defaults: { nombre: 'Demo', contraseña: 'password123' }
  });

  const [actividad] = await Actividad.findOrCreate({
    where: { key: 'test-1' },
    defaults: {
      activity: 'Actividad de prueba',
      type: 'recreational',
      participants: 1,
      accessibility: 0.1,
      price: 0
    }
  });

  await Favorito.create({ usuario_id: usuario.id, actividad_key: actividad.key });
  console.log('Datos de ejemplo creados');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
