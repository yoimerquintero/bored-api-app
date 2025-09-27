const { FavoriteService, ActivityService } = require('../services');

class FavoriteController {
  constructor() {
    this.favoriteService = new FavoriteService();
    this.activityService = new ActivityService();
  }

  // Agregar actividad a favoritos
  addFavorite = async (req, res) => {
    try {
      const { actividad_key } = req.body;
      const usuario_id = req.user.id;

      if (!actividad_key) {
        return res.status(400).json({
          success: false,
          error: 'La clave de la actividad es requerida'
        });
      }

      // Verificar que la actividad existe (obtenerla de la Bored API si no está en BD)
      const activityResult = await this.activityService.getActivityByKey(actividad_key);
      if (!activityResult.success) {
        // Si no existe en BD, obtener de la API
        const randomResult = await this.activityService.getRandomActivity();
        if (!randomResult.success || randomResult.data.key !== actividad_key) {
          return res.status(404).json({
            success: false,
            error: 'Actividad no encontrada'
          });
        }
        // Guardar la actividad en BD
        await this.activityService.saveActivity(randomResult.data);
      }

      const result = await this.favoriteService.addFavorite(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(201).json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en FavoriteController.addFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al agregar favorito'
      });
    }
  };

  // Obtener favoritos del usuario
  getFavorites = async (req, res) => {
    try {
      const usuario_id = req.user.id;

      const result = await this.favoriteService.getFavoritesByUser(usuario_id);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en FavoriteController.getFavorites:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener favoritos'
      });
    }
  };

  // Eliminar actividad de favoritos
  removeFavorite = async (req, res) => {
    try {
      const { actividad_key } = req.params;
      const usuario_id = req.user.id;

      const result = await this.favoriteService.removeFavorite(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en FavoriteController.removeFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al eliminar favorito'
      });
    }
  };

  // Verificar si una actividad es favorita
  checkFavorite = async (req, res) => {
    try {
      const { actividad_key } = req.params;
      const usuario_id = req.user.id;

      const result = await this.favoriteService.isFavorite(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: {
          isFavorite: result.data
        }
      });

    } catch (error) {
      console.error('Error en FavoriteController.checkFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al verificar favorito'
      });
    }
  };

  // Obtener estadísticas de favoritos
  getFavoritesStats = async (req, res) => {
    try {
      const usuario_id = req.user.id;

      const result = await this.favoriteService.getFavoritesStats(usuario_id);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en FavoriteController.getFavoritesStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener estadísticas'
      });
    }
  };

  // Toggle favorito (agregar/eliminar)
  toggleFavorite = async (req, res) => {
    try {
      const { actividad_key } = req.body;
      const usuario_id = req.user.id;

      if (!actividad_key) {
        return res.status(400).json({
          success: false,
          error: 'La clave de la actividad es requerida'
        });
      }

      // Verificar si ya es favorito
      const checkResult = await this.favoriteService.isFavorite(usuario_id, actividad_key);

      if (!checkResult.success) {
        return res.status(400).json({
          success: false,
          error: checkResult.error
        });
      }

      let result;
      if (checkResult.data) {
        // Si ya es favorito, eliminarlo
        result = await this.favoriteService.removeFavorite(usuario_id, actividad_key);
      } else {
        // Si no es favorito, agregarlo
        result = await this.favoriteService.addFavorite(usuario_id, actividad_key);
      }

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: {
          action: checkResult.data ? 'removed' : 'added',
          ...result.data
        }
      });

    } catch (error) {
      console.error('Error en FavoriteController.toggleFavorite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al alternar favorito'
      });
    }
  };
}

module.exports = FavoriteController;