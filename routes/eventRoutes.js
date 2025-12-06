const express = require('express');
const eventRouter = express.Router();
const {getAllEvenimente,getEvenimentById, createEveniment, updateEveniment, deleteEveniment} = require('../controllers/eventControllers');

eventRouter.get('/', getAllEvenimente);
eventRouter.get('/:id', getEvenimentById);

eventRouter.post('/', createEveniment);

eventRouter.put('/:id', updateEveniment);

eventRouter.delete('/:id', deleteEveniment);

module.exports = { eventRouter };
