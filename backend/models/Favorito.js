import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_guardado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favoritos',  
  freezeTableName: true,   
  timestamps: false        
});

export default Favorito;
