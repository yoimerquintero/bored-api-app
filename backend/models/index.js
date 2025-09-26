const User = require('./User');
const Activity = require('./Activity');
const Favorite = require('./Favorite');

// Definir relaciones
User.hasMany(Favorite, { foreignKey: 'usuario_id', as: 'favoritos' });
Favorite.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Activity.hasMany(Favorite, { foreignKey: 'actividad_key', as: 'favoritos' });
Favorite.belongsTo(Activity, { foreignKey: 'actividad_key', as: 'actividad' });

module.exports = {
  User,
  Activity,
  Favorite
};
