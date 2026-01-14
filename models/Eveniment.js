const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Eveniment = sequelize.define(
  'Eveniment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_final: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cod_acces: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    grup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grup_evenimente',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  },
  {
    tableName: 'eveniment',
    timestamps: false,
  }
);

module.exports = Eveniment;