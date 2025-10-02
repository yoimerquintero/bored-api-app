import { ActividadService } from '../services/index.js';

class ActividadController {
  constructor() {
    this.actividadService = new ActividadService();
  }

  /**
   * Obtener actividad aleatoria
   */
  getRandomActividad = async (req, res) => {
    try {
      const result = await this.actividadService.getRandomActividad();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      // Guardar en DB si es nueva
      const saveResult = await this.actividadService.saveActividad(result.data);
      if (saveResult.success && saveResult.created) {
        console.log('✅ Nueva actividad guardada en la base de datos');
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getRandomActividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad aleatoria'
      });
    }
  };

  /**
   * Obtener actividades aplicando filtros
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

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getActividadesByFilters:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al filtrar actividades'
      });
    }
  };

  /**
   * Obtener actividad por key
   */
  getActividadByKey = async (req, res) => {
    try {
      const { key } = req.params;
      const result = await this.actividadService.getActividadByKey(key);

      if (!result.success) {
        return res.status(404).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getActividadByKey:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad'
      });
    }
  };

  /**
   * Obtener todas las actividades
   */
  getAllActividades = async (req, res) => {
    try {
      const result = await this.actividadService.getAllActividades();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getAllActividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividades'
      });
    }
  };

  /**
   * Obtener lista de tipos de actividades
   */
  getActividadTypes = async (req, res) => {
    try {
      const result = await this.actividadService.getActividadTypes();

      if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('Error en ActividadController.getActividadTypes:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener tipos de actividades'
      });
    }
  };

  /**
   * Buscar actividades por término (texto)
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

      res.json({ success: true, data: filtered });
    } catch (error) {
      console.error('Error en ActividadController.searchActividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al buscar actividades'
      });
    }
  };
}

export default ActividadController;
