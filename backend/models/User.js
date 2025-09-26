const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
  contraseña: {
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
    beforeCreate: async (user) => {
      if (user.contraseña) {
        user.contraseña = await bcrypt.hash(user.contraseña, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed && user.changed('contraseña')) {
        user.contraseña = await bcrypt.hash(user.contraseña, 10);
      }
    }
  }
});

// Método para comparar contraseñas
User.prototype.validarContraseña = function(contraseña) {
  return bcrypt.compare(contraseña, this.contraseña);
};

module.exports = User;
