const { UsuarioController, ActividadController } = require('../controllers');

describe('Tests de Controladores', () => {
  let usuarioController;
  let actividadController;

  beforeAll(() => {
    usuarioController = new UsuarioController();
    actividadController = new ActividadController();
  });

  describe('UsuarioController', () => {
    test('debería validar campos obligatorios en registro', async () => {
      const mockReq = {
        body: {
          nombre: '',
          correo: '',
          contraseña: ''
        }
      };
      
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usuarioController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Nombre, correo y contraseña son obligatorios'
      });
    });

    test('debería validar longitud de contraseña', async () => {
      const mockReq = {
        body: {
          nombre: 'Test',
          correo: 'test@test.com',
          contraseña: '123'
        }
      };
      
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await usuarioController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    });
  });

  describe('ActividadController', () => {
    test('debería manejar parámetros de filtro correctamente', async () => {
      const mockReq = {
        query: {
          type: 'education',
          participants: '2'
        }
      };
      
      const mockRes = {
        json: jest.fn()
      };

      // Mock del servicio
      actividadController.actividadService.getActivitiesByFilters = jest.fn()
        .mockResolvedValue({
          success: true,
          data: { test: 'data' }
        });

      await actividadController.getActivitiesByFilters(mockReq, mockRes);

      expect(actividadController.actividadService.getActivitiesByFilters)
        .toHaveBeenCalledWith({
          type: 'education',
          participants: 2
        });
    });
  });
});
