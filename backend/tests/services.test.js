const { ActividadService, UsuarioService, FavoritoService } = require('../services');

describe('Tests de Servicios', () => {
  let actividadService;
  let usuarioService;
  let favoritoService;

  beforeAll(() => {
    actividadService = new ActividadService();
    usuarioService = new UsuarioService();
    favoritoService = new FavoritoService();
  });

  describe('ActividadService', () => {
    test('debería obtener una actividad aleatoria', async () => {
      const result = await actividadService.getRandomActivity();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('activity');
      expect(result.data).toHaveProperty('type');
      expect(result.data).toHaveProperty('participants');
    });

    test('debería manejar errores correctamente', async () => {
      // Simular un error cambiando la URL
      const originalUrl = actividadService.boredApiUrl;
      actividadService.boredApiUrl = 'http://invalid-url';
      
      const result = await actividadService.getRandomActivity();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      actividadService.boredApiUrl = originalUrl;
    });
  });

  describe('UsuarioService', () => {
    test('debería generar un token válido', () => {
      const mockUser = {
        id: 1,
        correo: 'test@example.com'
      };

      const token = usuarioService.generateToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('debería verificar un token válido', () => {
      const mockUser = {
        id: 1,
        correo: 'test@example.com'
      };

      const token = usuarioService.generateToken(mockUser);
      const decoded = usuarioService.verifyToken(token);
      
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.correo).toBe(mockUser.correo);
    });
  });
});
