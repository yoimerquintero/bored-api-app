// models/index.js
const { sequelize } = require('../config/database');

const Usuario = require('./Usuario');
const Actividad = require('./Actividad');
const Favorito = require('./Favorito');

// Relación Usuario ↔ Favoritos
Usuario.hasMany(Favorito, { foreignKey: 'usuario_id', as: 'favoritos' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Relación Actividad ↔ Favoritos
Actividad.hasMany(Favorito, { foreignKey: 'actividad_key', as: 'favoritos' });
Favorito.belongsTo(Actividad, { foreignKey: 'actividad_key', as: 'actividad' });


module.exports = {
  sequelize,
  Usuario,
  Actividad,
  Favorito
};
