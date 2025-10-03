import { DataTypes } from 'sequelize';
import  sequelize  from '../config/database.js';
import pkg from 'bcryptjs';

const { hash, compare } = pkg;

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {   // 🔹 mejor evitar "ñ" en nombres de columnas
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        usuario.password = await hash(usuario.password, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {   // ✅ forma correcta
        usuario.password = await hash(usuario.password, 10);
      }
    }
  }
});

// 🔹 Método de instancia para validar contraseña
Usuario.prototype.validarPassword = function (password) {
  return compare(password, this.password);
};

export default Usuario;
