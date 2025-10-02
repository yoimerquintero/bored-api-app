// controllers/FavoritoController.js
import { FavoritoService, ActividadService } from '../services/index.js';

class FavoritoController {
  constructor() {
    this.favoritoService = new FavoritoService();
    this.actividadService = new ActividadService();
  }

  /**
   * Agregar una actividad a favoritos
   */
  addFavorito = async (req, res) => {
    try {
      const { actividad_key } = req.body;
      const usuario_id = req.user.id;

      if (!actividad_key) {
        return res.status(400).json({
          success: false,
          error: 'La clave de la actividad es requerida'
        });
      }

      // Verificar si la actividad existe, si no, obtener de la API
      const actividadResult = await this.actividadService.getActividadByKey(actividad_key);
      if (!actividadResult.success) {
        const randomResult = await this.actividadService.getRandomActividad();

        if (!randomResult.success || randomResult.data.key !== actividad_key) {
          return res.status(404).json({
            success: false,
            error: 'Actividad no encontrada'
          });
        }

        await this.actividadService.saveActividad(randomResult.data);
      }

      const result = await this.favoritoService.addFavorito(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.status(201).json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en FavoritoController.addFavorito:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al agregar favorito'
      });
    }
  };

  /**
   * Obtener todos los favoritos de un usuario
   */
  getFavoritos = async (req, res) => {
    try {
      const usuario_id = req.user.id;
      const result = await this.favoritoService.getFavoritosByUsuario(usuario_id);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en FavoritoController.getFavoritos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener favoritos'
      });
    }
  };

  /**
   * Eliminar un favorito
   */
  removeFavorito = async (req, res) => {
    try {
      const { actividad_key } = req.params;
      const usuario_id = req.user.id;

      const result = await this.favoritoService.removeFavorito(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(404).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en FavoritoController.removeFavorito:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al eliminar favorito'
      });
    }
  };

  /**
   * Verificar si una actividad está marcada como favorito
   */
  checkFavorito = async (req, res) => {
    try {
      const { actividad_key } = req.params;
      const usuario_id = req.user.id;

      const result = await this.favoritoService.isFavorito(usuario_id, actividad_key);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({
        success: true,
        data: { isFavorito: result.data }
      });
    } catch (error) {
      console.error('Error en FavoritoController.checkFavorito:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al verificar favorito'
      });
    }
  };

  /**
   * Obtener estadísticas de favoritos por usuario
   */
  getFavoritosStats = async (req, res) => {
    try {
      const usuario_id = req.user.id;
      const result = await this.favoritoService.getFavoritosStats(usuario_id);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en FavoritoController.getFavoritosStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener estadísticas'
      });
    }
  };

  /**
   * Alternar favorito (toggle: agregar o eliminar)
   */
  toggleFavorito = async (req, res) => {
    try {
      const { actividad_key } = req.body;
      const usuario_id = req.user.id;

      if (!actividad_key) {
        return res.status(400).json({
          success: false,
          error: 'La clave de la actividad es requerida'
        });
      }

      const checkResult = await this.favoritoService.isFavorito(usuario_id, actividad_key);

      if (!checkResult.success) {
        return res.status(400).json({ success: false, error: checkResult.error });
      }

      let result;
      if (checkResult.data) {
        result = await this.favoritoService.removeFavorito(usuario_id, actividad_key);
      } else {
        result = await this.favoritoService.addFavorito(usuario_id, actividad_key);
      }

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({
        success: true,
        data: {
          action: checkResult.data ? 'removed' : 'added',
          ...result.data
        }
      });
    } catch (error) {
      console.error('Error en FavoritoController.toggleFavorito:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al alternar favorito'
      });
    }
  };
}

export default FavoritoController;
