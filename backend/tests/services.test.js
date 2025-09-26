const { ActivityService, UserService, FavoriteService } = require('../services');

describe('Services Tests', () => {
  let activityService;
  let userService;
  let favoriteService;

  beforeAll(() => {
    activityService = new ActivityService();
    userService = new UserService();
    favoriteService = new FavoriteService();
  });

  describe('ActivityService', () => {
    test('debería obtener una actividad aleatoria', async () => {
      const result = await activityService.getRandomActivity();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('activity');
      expect(result.data).toHaveProperty('type');
      expect(result.data).toHaveProperty('participants');
    });

    test('debería manejar errores correctamente', async () => {
      // Simular un error cambiando la URL
      const originalUrl = activityService.boredApiUrl;
      activityService.boredApiUrl = 'http://invalid-url';
      
      const result = await activityService.getRandomActivity();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      activityService.boredApiUrl = originalUrl;
    });
  });

  describe('UserService', () => {
    test('debería generar un token válido', () => {
      const mockUser = {
        id: 1,
        correo: 'test@example.com'
      };

      const token = userService.generateToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('debería verificar un token válido', () => {
      const mockUser = {
        id: 1,
        correo: 'test@example.com'
      };

      const token = userService.generateToken(mockUser);
      const decoded = userService.verifyToken(token);
      
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.correo).toBe(mockUser.correo);
    });
  });
});