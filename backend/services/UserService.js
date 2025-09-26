const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  // Registrar un nuevo usuario
  async register(userData) {
    try {
      const { nombre, correo, contraseña } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { correo } });
      if (existingUser) {
        return {
          success: false,
          error: 'El usuario ya existe con este correo'
        };
      }

      // Crear el usuario (el hash se hace automáticamente en el modelo)
      const user = await User.create({
        nombre,
        correo,
        contraseña
      });

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
      console.error('Error al registrar usuario:', error);
      return {
        success: false,
        error: 'No se pudo registrar el usuario'
      };
    }
  }

  // Login de usuario
  async login(correo, contraseña) {
    try {
      // Buscar usuario por correo
      const user = await User.findOne({ where: { correo } });
      if (!user) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // Validar contraseña
      const isValidPassword = await user.validarContraseña(contraseña);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // Generar token JWT
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
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        error: 'No se pudo iniciar sesión'
      };
    }
  }

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['contraseña'] }
      });

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return {
        success: false,
        error: 'No se pudo obtener el usuario'
      };
    }
  }

  // Actualizar perfil de usuario
  async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Actualizar solo los campos permitidos
      const allowedFields = ['nombre', 'correo'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
          updateData[field] = userData[field];
        }
      });

      await user.update(updateData);

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
      console.error('Error al actualizar usuario:', error);
      return {
        success: false,
        error: 'No se pudo actualizar el usuario'
      };
    }
  }

  // Generar token JWT
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        correo: user.correo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Verificar token JWT
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = UserService;