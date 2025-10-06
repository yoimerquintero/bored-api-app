// services/UsuarioService.js
import models from '../models/index.js';
import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;
const { Usuario } = models;

class UsuarioService {
  // Registrar un nuevo usuario
  async register(userData) {
    try {
      const { nombre, correo, password } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await Usuario.findOne({ where: { correo } });
      if (existingUser) {
        return {
          success: false,
          error: 'Ya existe un usuario con este correo'
        };
      }

      // Crear el usuario
      const user = await Usuario.create({ nombre, correo, password });


      // Generar token JWT
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            createdAt: user.createdAt
          },
          token
        }
      };
    } catch (error) {
      console.error('Error en UsuarioService.register:', error);
      return { success: false, error: error.message };
    }
  }

  async login(correo, password) {
    try {
      const user = await Usuario.findOne({ where: { correo } });
      if (!user) return { success: false, error: 'Credenciales incorrectas' };

      const isValidPassword = await user.validarPassword(password);

      if (!isValidPassword) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo
          },
          token
        }
      };
    } catch (error) {
      console.error('Error en UsuarioService.login:', error);
      return { success: false, error: 'No se pudo iniciar sesión' };
    }
  }

  async getUserById(id) {
    try {
      const user = await Usuario.findByPk(id, {
        attributes: { exclude: ['contraseña'] }
      });
      if (!user) return { success: false, error: 'Usuario no encontrado' };

      return { success: true, data: user };
    } catch (error) {
      console.error('Error en UsuarioService.getUserById:', error);
      return { success: false, error: 'No se pudo obtener el usuario' };
    }
  }

  async updateUser(id, userData) {
    try {
      const user = await Usuario.findByPk(id);
      if (!user) return { success: false, error: 'Usuario no encontrado' };

      const allowedFields = ['nombre', 'correo'];
      const updatedData = {};

      allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
          updatedData[field] = userData[field];
        }
      });

      await user.update(updatedData);

      return {
        success: true,
        data: {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          updatedAt: user.updatedAt
        }
      };
    } catch (error) {
      console.error('Error en UsuarioService.updateUser:', error);
      return { success: false, error: 'No se pudo actualizar el usuario' };
    }
  }

  generateToken(user) {
    return sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token) {
    try {
      return verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

export default UsuarioService;
