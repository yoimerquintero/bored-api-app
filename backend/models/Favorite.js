const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_guardado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favoritos',
  freezeTableName: true,
  timestamps: false
});

module.exports = Favorite;