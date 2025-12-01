// app.js

// 1. Incarca variabilele de mediu
// Citeste PORT=3000, DB_NAME=presence.sqlite etc. din fisierul .env
require('dotenv').config(); 
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const port = process.env.PORT || 5000;

// Middleware (logica care ruleaza pe toate cererile)
// app.use(express.json()) ii spune serverului sa poata citi date in format JSON
app.use(express.json()); 

// 2. Importa Modelele (Tabelele)
// Aceste linii pregatesc Sequelize pentru tabelele pe care le vom crea
// DACA ai primit eroare la rulare, este pentru ca fisierele nu exista INCA.
require('./models/Organizator'); 
require('./models/GrupEvenimente'); 
require('./models/Eveniment'); 
require('./models/InregistrarePrezenta.js'); 

// 3. Configurare Bază de Date (BD)
const sequelize = new Sequelize({
  dialect: 'sqlite', // Tipul bazei de date (SQLite)
  storage: process.env.DB_NAME, // Numele fisierului DB: presence.sqlite
  logging: false 
});

// 4. Testarea Conexiunii la BD si Pornirea Serverului
async function startServer() {
  try {
    // Sincronizeaza: Citeste modelele importate si le transforma in tabele SQL
    await sequelize.sync({ force: false }); 
    console.log('✅ Conexiunea la baza de date a fost stabilita si sincronizata.');

    // Ruta de test (Sanity Check)
    app.get('/', (req, res) => {
      res.send('Serverul de Back-End functioneaza! Asteapta rute API.');
    });

    // Aici vom adauga rutele reale (/api/auth, /api/grupuri)

    app.listen(port, () => {
      console.log(`🌍 Server pornit pe portul: http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Eroare la pornirea serverului sau la conectarea la BD:', error);
  }
}

startServer();

// Exporta conexiunea pentru a fi folosita in Modelele noastre
module.exports = { sequelize };