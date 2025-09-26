const { Favorite, Activity, User } = require('../models');

class FavoriteService {
  // Agregar actividad a favoritos
  async addFavorite(usuarioId, actividadKey) {
    try {
      // Verificar si el usuario existe
      const user = await User.findByPk(usuarioId);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Verificar si la actividad existe
      const activity = await Activity.findOne({ where: { key: actividadKey } });
      if (!activity) {
        return {
          success: false,
          error: 'Actividad no encontrada'
        };
      }

      // Verificar si ya está en favoritos
      const existingFavorite = await Favorite.findOne({
        where: { usuario_id: usuarioId, actividad_key: actividadKey }
      });

      if (existingFavorite) {
        return {
          success: false,
          error: 'La actividad ya está en favoritos'
        };
      }

      // Crear el favorito
      const favorite = await Favorite.create({
        usuario_id: usuarioId,
        actividad_key: actividadKey
      });

      // Cargar la información completa de la actividad
      const favoriteWithActivity = await Favorite.findByPk(favorite.id, {
        include: [
          {
            model: Activity,
            as: 'actividad',
            attributes: ['key', 'activity', 'type', 'participants', 'accessibility', 'price', 'link']
          }
        ]
      });

      return {
        success: true,
        data: favoriteWithActivity
      };
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      return {
        success: false,
        error: 'No se pudo agregar a favoritos'
      };
    }
  }

  // Obtener favoritos de un usuario
  async getFavoritesByUser(usuarioId) {
    try {
      const favorites = await Favorite.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: Activity,
            as: 'actividad',
            attributes: ['key', 'activity', 'type', 'participants', 'accessibility', 'price', 'link']
          }
        ],
        order: [['fecha_guardado', 'DESC']]
      });

      return {
        success: true,
        data: favorites
      };
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return {
        success: false,
        error: 'No se pudieron obtener los favoritos'
      };
    }
  }

  // Eliminar actividad de favoritos
  async removeFavorite(usuarioId, actividadKey) {
    try {
      const favorite = await Favorite.findOne({
        where: { usuario_id: usuarioId, actividad_key: actividadKey }
      });

      if (!favorite) {
        return {
          success: false,
          error: 'El favorito no existe'
        };
      }

      await favorite.destroy();

      return {
        success: true,
        data: { message: 'Favorito eliminado correctamente' }
      };
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      return {
        success: false,
        error: 'No se pudo eliminar el favorito'
      };
    }
  }

  // Verificar si una actividad es favorita de un usuario
  async isFavorite(usuarioId, actividadKey) {
    try {
      const favorite = await Favorite.findOne({
        where: { usuario_id: usuarioId, actividad_key: actividadKey }
      });

      return {
        success: true,
        data: !!favorite
      };
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return {
        success: false,
        error: 'No se pudo verificar el favorito'
      };
    }
  }

  // Obtener estadísticas de favoritos
  async getFavoritesStats(usuarioId) {
    try {
      const totalFavorites = await Favorite.count({
        where: { usuario_id: usuarioId }
      });

      const favoritesByType = await Favorite.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: Activity,
            as: 'actividad',
            attributes: ['type']
          }
        ],
        raw: true
      });

      const typeCount = {};
      favoritesByType.forEach(fav => {
        const type = fav['actividad.type'];
        typeCount[type] = (typeCount[type] || 0) + 1;
      });

      return {
        success: true,
        data: {
          total: totalFavorites,
          byType: typeCount
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de favoritos:', error);
      return {
        success: false,
        error: 'No se pudieron obtener las estadísticas'
      };
    }
  }
}

module.exports = FavoriteService;