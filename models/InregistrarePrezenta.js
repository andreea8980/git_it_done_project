const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const InregistrarePrezenta = sequelize.define(
  'InregistrarePrezenta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume_participant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_participant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp_confirmare: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    eveniment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'eveniment',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
  },
  {
    tableName: 'inregistrare_prezenta',
    timestamps: false,
    indexes: [
      //pentru a nu avea dubluri la acelasi eveniment
      {
        unique: true,
        fields: ['eveniment_id', 'email_participant'],
      },
    ],
  }
);

module.exports = InregistrarePrezenta;
