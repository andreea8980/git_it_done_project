const Eveniment = require('../models/Eveniment');
const GrupEvenimente = require('../models/GrupEvenimente');

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

//post /api/evenimente - create 
const createEveniment = async (req, res) => {
  const { data_start, data_final, grup_id } = req.body;

  if (!data_start || !data_final || !grup_id) {
    return res.status(400).json({ message: 'data_start, data_final și grup_id sunt obligatorii' });
  }

  try {
    const grup = await GrupEvenimente.findByPk(grup_id);
    if (!grup) {
      return res.status(404).json({
      message: 'Grupul de evenimente nu exista'
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
const getAllEvenimente = async (req, res) => {
  try {
    const evenimente = await Eveniment.findAll();
    res.status(200).json(evenimente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get /api/evenimente/:id - obtinem toate evenimentele dupa id
const getEvenimentById = async (req, res) => {
  try {
    const eveniment = await Eveniment.findByPk(req.params.id);

    if (!eveniment) {
      return res.status(404).json({ message: 'Evenimentul nu a fost gasit' });
    }

    res.status(200).json(eveniment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//put /api/evenimente/:id - actualizare eveniment
const updateEveniment = async (req, res) => {
  try {
    const eveniment = await Eveniment.findByPk(req.params.id);

    if (!eveniment) {
      return res.status(404).json({ message: 'Evenimentul nu exista' });
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
const deleteEveniment = async (req, res) => {
  try {
    const deleted = await Eveniment.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Evenimentul nu exista' });
    }

    res.status(200).json({ 
        message: 'evenimentul a fost sters cu succes.'
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {createEveniment,getAllEvenimente,getEvenimentById,updateEveniment,deleteEveniment};