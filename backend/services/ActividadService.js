import axios from 'axios';
import Actividad from '../models/Actividad.js';

class ActividadService {
  constructor() {
    this.boredApiUrl = process.env.BORED_API_URL || 'http://www.boredapi.com/api/activity';
    console.log('🔗 URL de Bored API configurada:', this.boredApiUrl);
  }

  // Obtener una actividad aleatoria de la Bored API con fallback
  async getRandomActividad() {
    // Primero intentar con la API externa
    const apiResult = await this.tryBoredAPI();
    if (apiResult.success) {
      return apiResult;
    }

    console.log('🔄 La API externa falló, usando datos de prueba...');
    
    // Fallback: datos de prueba
    return this.getFallbackActivity();
  }

  // Intentar conectar con Bored API
  async tryBoredAPI() {
    try {
      console.log('🔄 Conectando con Bored API...');
      
      const response = await axios.get(this.boredApiUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'BoredAPI-App/1.0.0',
          'Accept': 'application/json'
        }
      });

      if (!response.data || !response.data.activity) {
        throw new Error('Respuesta vacía de la API');
      }

      console.log('✅ Actividad obtenida de Bored API:', response.data.activity);
      return {
        success: true,
        data: response.data,
        source: 'boredapi'
      };
    } catch (error) {
      console.error('❌ Error conectando con Bored API:');
      console.error('   - Mensaje:', error.message);
      console.error('   - Código:', error.code);
      
      if (error.response) {
        console.error('   - Status:', error.response.status);
        console.error('   - Datos:', error.response.data);
      } else if (error.request) {
        console.error('   - No se recibió respuesta');
      }
      
      return {
        success: false,
        error: 'Bored API no disponible: ' + error.message
      };
    }
  }

  // Datos de prueba como fallback
  getFallbackActivity() {
    const actividadesPrueba = [
      {
        key: "fallback_" + Date.now() + "_1",
        activity: "Aprender un nuevo lenguaje de programación",
        type: "education",
        participants: 1,
        price: 0,
        accessibility: 0.1,
        link: ""
      },
      {
        key: "fallback_" + Date.now() + "_2", 
        activity: "Hacer una caminata en la naturaleza",
        type: "recreational",
        participants: 1,
        price: 0,
        accessibility: 0.1,
        link: ""
      },
      {
        key: "fallback_" + Date.now() + "_3",
        activity: "Cocinar una nueva receta",
        type: "cooking", 
        participants: 1,
        price: 0.3,
        accessibility: 0.2,
        link: ""
      }
    ];
    
    const actividadAleatoria = actividadesPrueba[Math.floor(Math.random() * actividadesPrueba.length)];
    
    console.log('🔄 Usando actividad de prueba:', actividadAleatoria.activity);
    
    return {
      success: true,
      data: actividadAleatoria,
      source: 'fallback'
    };
  }

  // Guardar una actividad en la base de datos
  async saveActividad(activityData) {
    try {
      console.log('💾 Intentando guardar actividad en BD:', activityData.key);
      
      const [actividad, created] = await Actividad.findOrCreate({
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

      if (created) {
        console.log('✅ Actividad guardada en BD:', activityData.key);
      } else {
        console.log('ℹ️ Actividad ya existía en BD:', activityData.key);
      }

      return {
        success: true,
        data: actividad,
        created
      };
    } catch (error) {
      console.error('❌ Error al guardar actividad:', error.message);
      return {
        success: false,
        error: 'No se pudo guardar la actividad en la base de datos: ' + error.message
      };
    }
  }

  // Obtener todas las actividades de la base de datos
  async getAllActividades() {
    try {
      console.log('🔍 Obteniendo todas las actividades de la BD...');
      
      const actividades = await Actividad.findAll();
      
      console.log(`📊 Encontradas ${actividades.length} actividades en BD`);
      
      return {
        success: true,
        data: actividades
      };
    } catch (error) {
      console.error('❌ Error CRÍTICO al obtener todas las actividades:');
      console.error('   - Mensaje:', error.message);
      console.error('   - Stack:', error.stack);
      
      return {
        success: false,
        error: 'Error de base de datos: ' + error.message
      };
    }
  }

  // Obtener actividades por tipo
  async getActividadesByType(tipo) {
    try {
      console.log(`🔍 Buscando actividades de tipo: ${tipo}`);
      
      const actividades = await Actividad.findAll({
        where: { type: tipo }
      });

      console.log(`📊 Encontradas ${actividades.length} actividades de tipo ${tipo}`);
      
      return {
        success: true,
        data: actividades
      };
    } catch (error) {
      console.error('❌ Error al obtener actividades por tipo:', error.message);
      return {
        success: false,
        error: 'No se pudieron obtener las actividades por tipo: ' + error.message
      };
    }
  }

  // Obtener actividades con límite
  async getActividadesWithLimit(limit) {
    try {
      console.log(`🔍 Obteniendo hasta ${limit} actividades`);
      
      const actividades = await Actividad.findAll({
        limit: limit
      });

      console.log(`📊 Obtenidas ${actividades.length} actividades`);
      
      return {
        success: true,
        data: actividades
      };
    } catch (error) {
      console.error('❌ Error al obtener actividades con límite:', error.message);
      return {
        success: false,
        error: 'No se pudieron obtener las actividades: ' + error.message
      };
    }
  }

  // Obtener una actividad por su clave (key)
  async getActividadByKey(key) {
    try {
      const actividad = await Actividad.findOne({ where: { key } });

      if (!actividad) {
        return {
          success: false,
          error: 'Actividad no encontrada'
        };
      }

      return {
        success: true,
        data: actividad
      };
    } catch (error) {
      console.error('❌ Error al obtener actividad por clave:', error);
      return {
        success: false,
        error: 'No se pudo obtener la actividad'
      };
    }
  }

  // Obtener tipos de actividades disponibles
  async getActividadTypes() {
    try {
      const tipos = await Actividad.findAll({
        attributes: ['type'],
        group: ['type'],
        raw: true
      });

      return {
        success: true,
        data: tipos.map(item => item.type)
      };
    } catch (error) {
      console.error('❌ Error al obtener tipos de actividades:', error);
      return {
        success: false,
        error: 'No se pudieron obtener los tipos de actividades'
      };
    }
  }

  // Método de prueba para verificar la conexión con la BD
  async testDatabaseConnection() {
    try {
      // Intentar una consulta simple
      const count = await Actividad.count();
      console.log(`✅ Conexión a BD OK. Total actividades: ${count}`);
      return { success: true, count };
    } catch (error) {
      console.error('❌ Error de conexión a BD:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export default ActividadService;