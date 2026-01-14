require('dotenv').config(); 
const express = require('express');
const { sequelize } = require('./db.js');
const app = express();
const port = process.env.PORT || 3000;

//importam rutele:
const { organizatorRouter } = require('./routes/organizatorRoutes.js');
const { grupRouter } = require('./routes/grupRoutes.js');
const { eventRouter } = require('./routes/eventRoutes.js');
const { prezentaRouter } = require('./routes/prezentaRoutes.js');

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

// actualizare - relatii pentru CASCADE DELETE
Organizator.hasMany(GrupEvenimente, { 
  foreignKey: 'organizator_id',
  onDelete: 'CASCADE' 
});
GrupEvenimente.belongsTo(Organizator, { 
  foreignKey: 'organizator_id' 
});

GrupEvenimente.hasMany(Eveniment, { 
  foreignKey: 'grup_id',
  onDelete: 'CASCADE' 
});
Eveniment.belongsTo(GrupEvenimente, { 
  foreignKey: 'grup_id' 
});

Eveniment.hasMany(InregistrarePrezenta, { 
  foreignKey: 'eveniment_id',
  onDelete: 'CASCADE' 
});
InregistrarePrezenta.belongsTo(Eveniment, { 
  foreignKey: 'eveniment_id' 
});

app.use(express.json()); 
app.use('/api/organizatori',organizatorRouter);
app.use('/api/grupuri',grupRouter);
app.use('/api/evenimente', eventRouter);
app.use('/api/prezenta', prezentaRouter);

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