const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bored API - Documentación',
      version: '1.0.0',
      description: 'API para encontrar actividades cuando estás aburrido. Proyecto académico para Lenguaje de Programación III.',
      contact: {
        name: 'Yoimer Andres Martinez Quintero',
        email: 'yoimer.martinez@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://tu-dominio.herokuapp.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['nombre', 'correo', 'contraseña'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario'
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario'
            },
            contraseña: {
              type: 'string',
              format: 'password',
              description: 'Contraseña (mínimo 6 caracteres)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'ID único de la actividad'
            },
            activity: {
              type: 'string',
              description: 'Descripción de la actividad'
            },
            type: {
              type: 'string',
              description: 'Tipo de actividad (education, recreational, social, etc.)'
            },
            participants: {
              type: 'integer',
              description: 'Número de participantes requeridos'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 1,
              description: 'Precio de la actividad (0 = gratis, 1 = muy caro)'
            },
            accessibility: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 1,
              description: 'Accesibilidad (0 = muy accesible, 1 = poco accesible)'
            },
            link: {
              type: 'string',
              description: 'Enlace relacionado con la actividad'
            }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            usuario_id: {
              type: 'integer'
            },
            actividad_key: {
              type: 'string'
            },
            fecha_guardado: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Mensaje de error descriptivo'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Datos de la respuesta'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // archivos que contienen documentación
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Ruta para la UI de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bored API Documentation"
  }));

  // Ruta para el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 Documentación Swagger disponible en: http://localhost:3001/api-docs');
};

module.exports = swaggerDocs;