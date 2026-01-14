const Eveniment = require('../models/Eveniment');
const GrupEvenimente = require('../models/GrupEvenimente');

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

//post /api/evenimente - create 
// actualizare - verificam ca grupul apartine organizatorului autentificat
const createEveniment = async (req, res) => {
  const { data_start, data_final, grup_id } = req.body;
  const organizator_id = req.user.id; // din token

  if (!data_start || !data_final || !grup_id) {
    return res.status(400).json({ message: 'data_start, data_final si grup_id sunt obligatorii' });
  }

  try {
    const grup = await GrupEvenimente.findOne({
      where: {
        id: grup_id,
        organizator_id // verificam ca grupul apartine user-ului
      }
    });
    if (!grup) {
      return res.status(404).json({
      message: 'Grupul de evenimente nu exista sau nu aveti permisiunea sa creati evenimente in el'
      });
    }
    const eveniment = await Eveniment.create({
      data_start,
      data_final,
      grup_id,
      cod_acces: generateCode(),
    });

    res.status(201).json(eveniment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get /api/evenimente- obtinem toate evenimentele
// actualizare - obtinem doar evenimentele din grupul organizatorului autentificat
const getAllEvenimente = async (req, res) => {
  try {
    const organizator_id = req.user.id; // din token
    
    // gasim toate grupurile organizatorului
    const grupuriOrganizator = await GrupEvenimente.findAll({
      where: { organizator_id },
      attributes: ['id']
    });

    const grupIds = grupuriOrganizator.map(g => g.id);
    
    // gasim evenimentele doar din aceste grupuri
    const evenimente = await Eveniment.findAll({
      where: { 
        grup_id: grupIds 
      },
      include: [{
        model: GrupEvenimente,
        attributes: ['titlu', 'organizator_id']
      }]
    });

    res.status(200).json(evenimente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get /api/evenimente/:id - obtinem toate evenimentele dupa id
// actualizare - verificam ownership ul prin grup
const getEvenimentById = async (req, res) => {
  try {
    const organizator_id = req.user.id;
    
    const eveniment = await Eveniment.findByPk(req.params.id, {
      include: [{
        model: GrupEvenimente,
        attributes: ['titlu', 'organizator_id']
      }]
    });

    if (!eveniment) {
      return res.status(404).json({ message: 'Evenimentul nu a fost gasit' });
    }
    
    // verificam ca evenimentul apartine unui grup al organizatorului
    if (eveniment.GrupEvenimente.organizator_id !== organizator_id) {
      return res.status(403).json({ 
        message: 'Nu aveti permisiunea sa accesati acest eveniment' 
      });
    }

    res.status(200).json(eveniment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//put /api/evenimente/:id - update eveniment
// actualizare - verificam ownership ul prin grup
const updateEveniment = async (req, res) => {
  try {
    const organizator_id = req.user.id;
    
    const eveniment = await Eveniment.findByPk(req.params.id, {
      include: [{
        model: GrupEvenimente,
        attributes: ['organizator_id']
      }]
    });

    if (!eveniment) {
      return res.status(404).json({ message: 'Evenimentul nu exista' });
    }
    
    // Verificam ownership
    if (eveniment.GrupEvenimente.organizator_id !== organizator_id) {
      return res.status(403).json({ 
        message: 'Nu aveti permisiunea sa modificati acest eveniment' 
      });
    }
    
    const { data_start, data_final } = req.body;
    await eveniment.update({
      data_start: data_start ?? eveniment.data_start,
      data_final: data_final ?? eveniment.data_final,
      // nu vom puteam modifica id sau grup_id
    });

    res.status(200).json(eveniment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete /api/eveniment/:id - stergere eveniment
// actualizare - verificam ownership ul 
const deleteEveniment = async (req, res) => {
  try {
    const organizator_id = req.user.id;
    
    const eveniment = await Eveniment.findByPk(req.params.id, {
      include: [{
        model: GrupEvenimente,
        attributes: ['organizator_id']
      }]
    });

    if (!eveniment) {
      return res.status(404).json({ message: 'Evenimentul nu exista' });
    }
    
    // verificam ownership
    if (eveniment.GrupEvenimente.organizator_id !== organizator_id) {
      return res.status(403).json({ 
        message: 'Nu aveti permisiunea sa stergeti acest eveniment' 
      });
    }
    
    await eveniment.destroy();

    res.status(200).json({ 
        message: 'evenimentul a fost sters cu succes.'
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {createEveniment,getAllEvenimente,getEvenimentById,updateEveniment,deleteEveniment};