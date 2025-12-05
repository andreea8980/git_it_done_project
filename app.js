require('dotenv').config(); 
const express = require('express');
const { sequelize } = require('./db.js');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 

require('./models/Organizator'); 
require('./models/GrupEvenimente'); 
require('./models/Eveniment'); 
require('./models/InregistrarePrezenta.js'); 

//definirea relatiilor dintre tabele
const Organizator = require('./models/Organizator');
const GrupEvenimente = require('./models/GrupEvenimente');
const Eveniment = require('./models/Eveniment');
const InregistrarePrezenta = require('./models/InregistrarePrezenta');

Organizator.hasMany(GrupEvenimente, { foreignKey: 'organizator_id' });
GrupEvenimente.belongsTo(Organizator, { foreignKey: 'organizator_id' });

GrupEvenimente.hasMany(Eveniment, { foreignKey: 'grup_id' });
Eveniment.belongsTo(GrupEvenimente, { foreignKey: 'grup_id' });

Eveniment.hasMany(InregistrarePrezenta, { foreignKey: 'eveniment_id' });
InregistrarePrezenta.belongsTo(Eveniment, { foreignKey: 'eveniment_id' });

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