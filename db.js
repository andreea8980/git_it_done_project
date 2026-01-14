require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_NAME,
      logging: false
    });

// PRAGMA functioneaza doar pt SQLite, ignoram eroarea pt PostgreSQL
sequelize.query('PRAGMA foreign_keys = ON;').catch(() => {
  // silent fail pentru PostgreSQL
});

module.exports = { sequelize };