const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  actividad_key: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'actividades',
      key: 'key'
    }
  },
  fecha_guardado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favoritos',
  timestamps: false
});

module.exports = Favorite;
