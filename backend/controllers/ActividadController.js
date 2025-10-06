import { ActividadService } from '../services/index.js';
import Actividad from '../models/Actividad.js';

class ActividadController {
  constructor() {
    this.actividadService = new ActividadService();
  }

  /**
   * Obtener actividad aleatoria
   */
  getRandomActividad = async (req, res) => {
    try {
      console.log('🎯 Solicitando actividad aleatoria...');
      
      const result = await this.actividadService.getRandomActividad();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      // Guardar en DB si es nueva
      const saveResult = await this.actividadService.saveActividad(result.data);
      if (saveResult.success && saveResult.created) {
        console.log('✅ Nueva actividad guardada en la base de datos:', result.data.key);
      } else if (saveResult.success) {
        console.log('ℹ️ Actividad ya existía en BD:', result.data.key);
      }

      res.json({ 
        success: true, 
        datos: result.data,
        guardadoEnBD: saveResult.success,
        fueNueva: saveResult.created 
      });
    } catch (error) {
      console.error('Error en ActividadController.getRandomActividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad aleatoria'
      });
    }
  };

  /**
   * Obtener todas las actividades
   */
  getAll = async (req, res) => {
    try {
      const result = await this.actividadService.getAllActividades();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      res.json({ 
        success: true, 
        datos: result.data,
        total: result.data.length 
      });
    } catch (error) {
      console.error('Error en ActividadController.getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividades'
      });
    }
  };

  /**
   * Obtener tipos de actividades
   */
  getTipos = async (req, res) => {
    try {
      const result = await this.actividadService.getActividadTypes();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      res.json({ 
        success: true, 
        datos: result.data 
      });
    } catch (error) {
      console.error('Error en ActividadController.getTipos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener tipos de actividades'
      });
    }
  };

  /**
   * Obtener actividad por clave
   */
  getActividadByKey = async (req, res) => {
    try {
      const { clave } = req.params;
      const result = await this.actividadService.getActividadByKey(clave);

      if (!result.success) {
        return res.status(404).json({ success: false, error: result.error });
      }

      res.json({ success: true, datos: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getActividadByKey:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad'
      });
    }
  };

  /**
   * Borrar todas las actividades
   */
  deleteAllActividades = async (req, res) => {
    try {
      console.log('🗑️ Solicitando borrado de todas las actividades...');
      
      // Contar actividades antes
      const countBefore = await Actividad.count();
      console.log(`📊 Actividades antes: ${countBefore}`);

      let deletedCount = 0;
      
      if (countBefore > 0) {
        // Borrar todas las actividades usando el modelo ya importado
        deletedCount = await Actividad.destroy({
          where: {},
          truncate: false
        });
        console.log(`🗑️ Se borraron ${deletedCount} actividades`);
      } else {
        console.log('ℹ️ No hay actividades para borrar');
      }

      // Contar actividades después
      const countAfter = await Actividad.count();
      console.log(`📊 Actividades después: ${countAfter}`);

      res.json({
        success: true,
        message: `Se eliminaron ${deletedCount} actividades de la base de datos`,
        eliminadas: deletedCount,
        countBefore: countBefore,
        countAfter: countAfter
      });
      
    } catch (error) {
      console.error('❌ Error al borrar actividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al borrar actividades',
        detalles: error.message
      });
    }
  };

  /**
   * Buscar actividades por término
   */
  searchActividades = async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ success: false, error: 'Término de búsqueda requerido' });
      }

      const result = await this.actividadService.getAllActividades();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      const filtered = result.data.filter(a =>
        a.activity.toLowerCase().includes(q.toLowerCase()) ||
        a.type.toLowerCase().includes(q.toLowerCase())
      );

      res.json({ 
        success: true, 
        datos: filtered,
        total: filtered.length 
      });
    } catch (error) {
      console.error('Error en ActividadController.searchActividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al buscar actividades'
      });
    }
  };

  /**
   * Obtener actividades con filtros
   */
  getActividadesByFilters = async (req, res) => {
    try {
      const { type, participants, minPrice, maxPrice, minAccessibility, maxAccessibility } = req.query;

      const filters = {};
      if (type && type !== 'all') filters.type = type;
      if (participants) filters.participants = parseInt(participants);

      if (minPrice !== undefined || maxPrice !== undefined) {
        filters.price = {};
        if (minPrice !== undefined) filters.price.min = parseFloat(minPrice);
        if (maxPrice !== undefined) filters.price.max = parseFloat(maxPrice);
      }

      if (minAccessibility !== undefined || maxAccessibility !== undefined) {
        filters.accessibility = {};
        if (minAccessibility !== undefined) filters.accessibility.min = parseFloat(minAccessibility);
        if (maxAccessibility !== undefined) filters.accessibility.max = parseFloat(maxAccessibility);
      }

      const result = await this.actividadService.getActividadesByFilters(filters);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({ success: true, datos: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getActividadesByFilters:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al filtrar actividades'
      });
    }
  };

  /**
   * Obtener actividades por tipo específico
   */
  getActividadesByType = async (req, res) => {
    try {
      const { tipo } = req.params;
      
      console.log(`🎯 Buscando actividades de tipo: ${tipo}`);
      
      const result = await this.actividadService.getActividadesByType(tipo);

      if (!result.success) {
        return res.status(500).json({ 
          success: false, 
          error: result.error 
        });
      }

      res.json({ 
        success: true, 
        datos: result.data,
        total: result.data.length,
        tipo: tipo
      });
    } catch (error) {
      console.error('💥 Error en ActividadController.getActividadesByType:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividades por tipo: ' + error.message
      });
    }
  };

  /**
   * Obtener actividades con límite
   */
  getActividadesWithLimit = async (req, res) => {
    try {
      let { limit } = req.query;
      
      // Validar y establecer límite máximo de 15
      limit = parseInt(limit) || 10;
      if (limit > 15) {
        limit = 15;
      }
      
      console.log(`🎯 Solicitando ${limit} actividades`);

      const result = await this.actividadService.getActividadesWithLimit(limit);

      if (!result.success) {
        return res.status(500).json({ 
          success: false, 
          error: result.error 
        });
      }

      res.json({ 
        success: true, 
        datos: result.data,
        total: result.data.length,
        limit: limit
      });
    } catch (error) {
      console.error('💥 Error en ActividadController.getActividadesWithLimit:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividades con límite: ' + error.message
      });
    }
  };
}

export default ActividadController;