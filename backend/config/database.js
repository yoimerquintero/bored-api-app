// config/database.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bored_api',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'merly2813',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false,
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la BD establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la BD:', error);
    return false;
  }
};

export const sync = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
  }
};

// 👇 Exportar de las dos formas
export { sequelize };
export default sequelize;
