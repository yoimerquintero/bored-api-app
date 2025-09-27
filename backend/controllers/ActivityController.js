const { ActivityService } = require('../services');

class ActivityController {
  constructor() {
    this.activityService = new ActivityService();
  }

  // Obtener actividad aleatoria
  getRandomActivity = async (req, res) => {
    try {
      const result = await this.activityService.getRandomActivity();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      // Opcional: Guardar la actividad en la base de datos
      const saveResult = await this.activityService.saveActivity(result.data);
      if (saveResult.success && saveResult.created) {
        console.log('✅ Nueva actividad guardada en la base de datos');
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en ActivityController.getRandomActivity:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad aleatoria'
      });
    }
  };

  // Obtener actividades con filtros
  getActivitiesByFilters = async (req, res) => {
    try {
      const { type, participants, minPrice, maxPrice, minAccessibility, maxAccessibility } = req.query;

      const filters = {};
      
      if (type && type !== 'all') filters.type = type;
      if (participants) filters.participants = parseInt(participants);
      
      // Manejar rangos de precio y accesibilidad
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

      const result = await this.activityService.getActivitiesByFilters(filters);

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
      console.error('Error en ActivityController.getActivitiesByFilters:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al filtrar actividades'
      });
    }
  };

  // Obtener actividad por key
  getActivityByKey = async (req, res) => {
    try {
      const { key } = req.params;

      const result = await this.activityService.getActivityByKey(key);

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
      console.error('Error en ActivityController.getActivityByKey:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividad'
      });
    }
  };

  // Obtener todas las actividades (de la base de datos)
  getAllActivities = async (req, res) => {
    try {
      const result = await this.activityService.getAllActivities();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en ActivityController.getAllActivities:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener actividades'
      });
    }
  };

  // Obtener tipos de actividades disponibles
  getActivityTypes = async (req, res) => {
    try {
      const result = await this.activityService.getActivityTypes();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en ActivityController.getActivityTypes:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener tipos de actividades'
      });
    }
  };

  // Buscar actividades por término
  searchActivities = async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Término de búsqueda requerido'
        });
      }

      const result = await this.activityService.getAllActivities();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      // Filtrar actividades por término de búsqueda
      const filteredActivities = result.data.filter(activity =>
        activity.activity.toLowerCase().includes(q.toLowerCase()) ||
        activity.type.toLowerCase().includes(q.toLowerCase())
      );

      res.json({
        success: true,
        data: filteredActivities
      });

    } catch (error) {
      console.error('Error en ActivityController.searchActivities:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al buscar actividades'
      });
    }
  };
}

module.exports = ActivityController;