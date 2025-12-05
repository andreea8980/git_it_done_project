const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const GrupEvenimente = sequelize.define(
  'GrupEvenimente',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titlu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descriere: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data_final: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recurenta: {
      type: DataTypes.STRING, // sau putem cu JSON
      allowNull: true,
    },
    organizator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'grup_evenimente',
    timestamps: false,
  }
);

module.exports = GrupEvenimente;