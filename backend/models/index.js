const User = require('./User');
const Activity = require('./Activity');
const Favorite = require('./Favorite');

// Relación User ↔ Favorites
User.hasMany(Favorite, { foreignKey: 'usuario_id', sourceKey: 'id', as: 'favoritos' });
Favorite.belongsTo(User, { foreignKey: 'usuario_id', targetKey: 'id', as: 'usuario' });

// Relación Activity ↔ Favorites
Activity.hasMany(Favorite, { foreignKey: 'actividad_key', sourceKey: 'key', as: 'favoritos' });
Favorite.belongsTo(Activity, { foreignKey: 'actividad_key', targetKey: 'key', as: 'actividad' });

module.exports = {
  User,
  Activity,
  Favorite
};