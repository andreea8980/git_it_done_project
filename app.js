require('dotenv').config(); 
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 

require('./models/Organizator'); 
require('./models/GrupEvenimente'); 
require('./models/Eveniment'); 
require('./models/InregistrarePrezenta.js'); 

const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: process.env.DB_NAME, 
  logging: false 
});

async function startServer() {
  try {
    await sequelize.sync({ force: false }); 
    console.log('Conexiunea la baza de date a fost stabilita si sincronizata.');

    app.get('/', (req, res) => {
      res.send('Serverul de Back-End functioneaza! Asteapta rute API.');
    });

    app.listen(port, () => {
      console.log(`Server pornit pe portul: http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Eroare la pornirea serverului sau la conectarea la BD:', error);
  }
}

startServer();
module.exports = { sequelize };