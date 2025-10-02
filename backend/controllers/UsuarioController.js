// controllers/UsuarioController.js
import { UsuarioService } from '../services/index.js';

class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  /**
   * Registrar nuevo usuario
   */
  registrar = async (req, res) => {
    try {
      const { nombre, correo, password } = req.body;

      if (!nombre || !correo || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, correo y contraseña son obligatorios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      const result = await this.usuarioService.register({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        password
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Usuario registrado exitosamente'
      });
    } catch (error) {
      console.error('Error en UsuarioController.registrar:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al registrar usuario'
      });
    }
  };

  /**
   * Inicio de sesión
   */
  iniciarSesion = async (req, res) => {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.status(400).json({
          success: false,
          message: 'Correo y contraseña son obligatorios'
        });
      }

      const result = await this.usuarioService.login(
        correo.trim().toLowerCase(),
        password
      );

      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Inicio de sesión exitoso'
      });
    } catch (error) {
      console.error('Error en UsuarioController.iniciarSesion:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al iniciar sesión'
      });
    }
  };

  /**
   * Obtener perfil del usuario autenticado
   */
  obtenerPerfil = async (req, res) => {
    try {
      const result = await this.usuarioService.getUserById(req.usuario.id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      console.error('Error en UsuarioController.obtenerPerfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener perfil'
      });
    }
  };

  /**
   * Actualizar perfil del usuario autenticado
   */
  actualizarPerfil = async (req, res) => {
    try {
      const { nombre, correo } = req.body;

      if (!nombre && !correo) {
        return res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      const result = await this.usuarioService.updateUser(req.usuario.id, {
        nombre: nombre?.trim(),
        correo: correo?.trim().toLowerCase()
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Perfil actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error en UsuarioController.actualizarPerfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al actualizar perfil'
      });
    }
  };

  /**
   * Verificar token de autenticación
   */
  verificarToken = async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          usuario: req.usuario,
          valid: true
        },
        message: 'Token válido'
      });
    } catch (error) {
      console.error('Error en UsuarioController.verificarToken:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al verificar token'
      });
    }
  };
}

export default UsuarioController;
