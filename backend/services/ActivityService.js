const axios = require('axios');
const { Activity } = require('../models');

class ActivityService {
  constructor() {
    this.boredApiUrl = process.env.BORED_API_URL || 'http://www.boredapi.com/api/activity';
  }

  // Obtener una actividad aleatoria de la Bored API
  async getRandomActivity() {
    try {
      const response = await axios.get(this.boredApiUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener actividad aleatoria:', error);
      return {
        success: false,
        error: 'No se pudo obtener la actividad aleatoria'
      };
    }
  }

  // Obtener actividades por filtros
  async getActivitiesByFilters(filters) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar solo los filtros que tienen valor
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.participants) queryParams.append('participants', filters.participants);
      if (filters.price) queryParams.append('price', filters.price);
      if (filters.accessibility) queryParams.append('accessibility', filters.accessibility);

      const url = `${this.boredApiUrl}?${queryParams.toString()}`;
      const response = await axios.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener actividades con filtros:', error);
      return {
        success: false,
        error: 'No se pudieron obtener las actividades con los filtros proporcionados'
      };
    }
  }

  // Guardar una actividad en la base de datos
  async saveActivity(activityData) {
    try {
      const [activity, created] = await Activity.findOrCreate({
        where: { key: activityData.key },
        defaults: {
          activity: activityData.activity,
          type: activityData.type,
          participants: activityData.participants,
          accessibility: activityData.accessibility,
          price: activityData.price,
          link: activityData.link || null
        }
      });

      return {
        success: true,
        data: activity,
        created: created
      };
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      return {
        success: false,
        error: 'No se pudo guardar la actividad en la base de datos'
      };
    }
  }

  // Obtener una actividad por su key
  async getActivityByKey(key) {
    try {
      const activity = await Activity.findOne({ where: { key } });
      
      if (!activity) {
        return {
          success: false,
          error: 'Actividad no encontrada'
        };
      }

      return {
        success: true,
        data: activity
      };
    } catch (error) {
      console.error('Error al obtener actividad por key:', error);
      return {
        success: false,
        error: 'No se pudo obtener la actividad'
      };
    }
  }

  // Obtener todas las actividades de la base de datos
  async getAllActivities() {
    try {
      const activities = await Activity.findAll({
        order: [['type', 'ASC']]
      });

      return {
        success: true,
        data: activities
      };
    } catch (error) {
      console.error('Error al obtener todas las actividades:', error);
      return {
        success: false,
        error: 'No se pudieron obtener las actividades'
      };
    }
  }

  // Obtener tipos de actividades disponibles
  async getActivityTypes() {
    try {
      const types = await Activity.findAll({
        attributes: ['type'],
        group: ['type'],
        raw: true
      });

      return {
        success: true,
        data: types.map(item => item.type)
      };
    } catch (error) {
      console.error('Error al obtener tipos de actividades:', error);
      return {
        success: false,
        error: 'No se pudieron obtener los tipos de actividades'
      };
    }
  }
}

module.exports = ActivityService;