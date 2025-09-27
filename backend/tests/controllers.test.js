const { UserController, ActivityController } = require('../controllers');

describe('Controllers Tests', () => {
  let userController;
  let activityController;

  beforeAll(() => {
    userController = new UserController();
    activityController = new ActivityController();
  });

  describe('UserController', () => {
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

      await userController.register(mockReq, mockRes);

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

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    });
  });

  describe('ActivityController', () => {
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
      activityController.activityService.getActivitiesByFilters = jest.fn()
        .mockResolvedValue({
          success: true,
          data: { test: 'data' }
        });

      await activityController.getActivitiesByFilters(mockReq, mockRes);

      expect(activityController.activityService.getActivitiesByFilters)
        .toHaveBeenCalledWith({
          type: 'education',
          participants: 2
        });
    });
  });
});