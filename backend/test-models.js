const { sequelize, testConnection } = require('./config/database');
const { User, Activity, Favorite } = require('./models');

async function run() {
  await testConnection();
  // En desarrollo: sincroniza tablas (usa { force: true } solo si quieres borrar tablas)
  await sequelize.sync({ alter: true });
  console.log('Tablas sincronizadas');

  // Creación de ejemplo (opcional)
  const [user] = await User.findOrCreate({
    where: { correo: 'demo@example.com' },
    defaults: { nombre: 'Demo', contraseña: 'password123' }
  });

  const [activity] = await Activity.findOrCreate({
    where: { key: 'test-1' },
    defaults: {
      activity: 'Actividad de prueba',
      type: 'recreational',
      participants: 1,
      accessibility: 0.1,
      price: 0
    }
  });

  await Favorite.create({ usuario_id: user.id, actividad_key: activity.key });
  console.log('Datos de ejemplo creados');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
