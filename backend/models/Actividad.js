import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Actividad = sequelize.define('Actividad', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  activity: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  participants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  accessibility: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 1
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 1
    }
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'actividades',
  freezeTableName: true,
  timestamps: false
});

// Agregar método de sincronización para debugging
Actividad.sync({ force: false })
  .then(() => console.log('✅ Modelo Actividad sincronizado'))
  .catch(error => console.error('❌ Error sincronizando modelo Actividad:', error));

export default Actividad;