// services/FavoritoService.js
import models from '../models/index.js';

const { Favorito, Actividad, Usuario } = models;

class FavoritoService {
  // Agregar actividad a favoritos
  async addFavorito(userId, activityKey) {
    try {
      // Verificar si el usuario existe
      const user = await Usuario.findByPk(userId);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Verificar si la actividad existe
      const activity = await Actividad.findOne({ where: { key: activityKey } });
      if (!activity) {
        return {
          success: false,
          error: 'Actividad no encontrada'
        };
      }

      // Verificar si ya está en favoritos
      const existingFavorito = await Favorito.findOne({
        where: { usuario_id: userId, actividad_key: activityKey }
      });

      if (existingFavorito) {
        return {
          success: false,
          error: 'La actividad ya está en favoritos'
        };
      }

      // Crear el favorito
      const favorito = await Favorito.create({
        usuario_id: userId,
        actividad_key: activityKey
      });

      // Cargar la información completa de la actividad
      const favoritoWithActivity = await Favorito.findByPk(favorito.id, {
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['key', 'activity', 'type', 'participants', 'accessibility', 'price', 'link']
          }
        ]
      });

      return {
        success: true,
        data: favoritoWithActivity
      };
    } catch (error) {
      console.error('Error en addFavorito:', error);
      return {
        success: false,
        error: 'No se pudo agregar a favoritos'
      };
    }
  }

  // Obtener favoritos de un usuario
  async getFavoritosByUsuario(userId) {
    try {
      const favoritos = await Favorito.findAll({
        where: { usuario_id: userId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['key', 'activity', 'type', 'participants', 'accessibility', 'price', 'link']
          }
        ],
        order: [['fecha_guardado', 'DESC']]
      });

      return {
        success: true,
        data: favoritos
      };
    } catch (error) {
      console.error('Error en getFavoritosByUsuario:', error);
      return {
        success: false,
        error: 'No se pudieron obtener los favoritos'
      };
    }
  }

  // Eliminar actividad de favoritos
  async removeFavorito(userId, activityKey) {
    try {
      const favorito = await Favorito.findOne({
        where: { usuario_id: userId, actividad_key: activityKey }
      });

      if (!favorito) {
        return {
          success: false,
          error: 'El favorito no existe'
        };
      }

      await favorito.destroy();

      return {
        success: true,
        data: { message: 'Favorito eliminado correctamente' }
      };
    } catch (error) {
      console.error('Error en removeFavorito:', error);
      return {
        success: false,
        error: 'No se pudo eliminar el favorito'
      };
    }
  }

  // Verificar si una actividad es favorita de un usuario
  async isFavorito(userId, activityKey) {
    try {
      const favorito = await Favorito.findOne({
        where: { usuario_id: userId, actividad_key: activityKey }
      });

      return {
        success: true,
        data: !!favorito
      };
    } catch (error) {
      console.error('Error en isFavorito:', error);
      return {
        success: false,
        error: 'No se pudo verificar el favorito'
      };
    }
  }

  // Obtener estadísticas de favoritos
  async getFavoritosStats(userId) {
    try {
      const totalFavoritos = await Favorito.count({
        where: { usuario_id: userId }
      });

      const favoritosPorTipo = await Favorito.findAll({
        where: { usuario_id: userId },
        include: [
          {
            model: Actividad,
            as: 'actividad',
            attributes: ['type']
          }
        ],
        raw: true
      });

      const conteoPorTipo = {};
      favoritosPorTipo.forEach(fav => {
        const tipo = fav['actividad.type'];
        conteoPorTipo[tipo] = (conteoPorTipo[tipo] || 0) + 1;
      });

      return {
        success: true,
        data: {
          total: totalFavoritos,
          porTipo: conteoPorTipo
        }
      };
    } catch (error) {
      console.error('Error en getFavoritosStats:', error);
      return {
        success: false,
        error: 'No se pudieron obtener las estadísticas'
      };
    }
  }
}

export default FavoritoService;
