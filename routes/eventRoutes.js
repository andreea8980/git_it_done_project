const express = require('express');
const eventRouter = express.Router();
const {getAllEvenimente,getEvenimentById, createEveniment, updateEveniment, deleteEveniment} = require('../controllers/eventControllers');

// importam middleware de auth
const { authenticateToken } = require('../middleware/auth');

// aplicam middleware-ul de autentificare pentru toate rutele din acest router
// toate rutele vor necesita un token valid pentru a accesa resursele
eventRouter.get('/', authenticateToken, getAllEvenimente);
eventRouter.get('/:id', authenticateToken, getEvenimentById);
eventRouter.post('/', authenticateToken, createEveniment);
eventRouter.put('/:id', authenticateToken, updateEveniment);
eventRouter.delete('/:id', authenticateToken, deleteEveniment);

module.exports = { eventRouter };
