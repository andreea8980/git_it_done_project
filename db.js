require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',            
  storage: process.env.DB_NAME, 
  logging: false                
});

module.exports = { sequelize };
