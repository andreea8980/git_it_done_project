require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // Production (Render) -> PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local -> SQLite
  const dbName = process.env.DB_NAME || "presence.sqlite";
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbName,
    logging: false,
  });

  // PRAGMA doar pentru SQLite
  sequelize.query("PRAGMA foreign_keys = ON;");
}

module.exports = { sequelize };
