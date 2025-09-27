const { UserService } = require('../services');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Registrar nuevo usuario
  register = async (req, res) => {
    try {
      const { nombre, correo, contraseña } = req.body;

      // Validaciones básicas
      if (!nombre || !correo || !contraseña) {
        return res.status(400).json({
          success: false,
          error: 'Nombre, correo y contraseña son obligatorios'
        });
      }

      if (contraseña.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await this.userService.register({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        contraseña
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(201).json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en UserController.register:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al registrar usuario'
      });
    }
  };

  // Login de usuario
  login = async (req, res) => {
    try {
      const { correo, contraseña } = req.body;

      if (!correo || !contraseña) {
        return res.status(400).json({
          success: false,
          error: 'Correo y contraseña son obligatorios'
        });
      }

      const result = await this.userService.login(
        correo.trim().toLowerCase(), 
        contraseña
      );

      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });

    } catch (error) {
      console.error('Error en UserController.login:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al iniciar sesión'
      });
    }
  };

  // Obtener perfil del usuario autenticado
  getProfile = async (req, res) => {
    try {
      const result = await this.userService.getUserById(req.user.id);

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
      console.error('Error en UserController.getProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al obtener perfil'
      });
    }
  };

  // Actualizar perfil de usuario
  updateProfile = async (req, res) => {
    try {
      const { nombre, correo } = req.body;

      // Validar que al menos un campo sea proporcionado
      if (!nombre && !correo) {
        return res.status(400).json({
          success: false,
          error: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      const result = await this.userService.updateUser(req.user.id, {
        nombre: nombre?.trim(),
        correo: correo?.trim().toLowerCase()
      });

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
      console.error('Error en UserController.updateProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al actualizar perfil'
      });
    }
  };

  // Verificar token (para validar sesión en frontend)
  verifyToken = async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
          valid: true
        }
      });
    } catch (error) {
      console.error('Error en UserController.verifyToken:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor al verificar token'
      });
    }
  };
}

module.exports = UserController;