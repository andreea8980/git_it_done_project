const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Organizator = sequelize.define(
  'Organizator',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    parola_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_crearii: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'organizator',
    timestamps: false, 
  }
);

module.exports = Organizator;
