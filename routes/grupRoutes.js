const express = require('express');
const grupRouter = express.Router();
const {getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup} = require('../controllers/grupControllers');

// importam middleware de auth
const { authenticateToken } = require('../middleware/auth');

// aplicam middleware-ul de autentificare pentru toate rutele din acest router
// toate rutele vor necesita un token valid pentru a accesa resursele
grupRouter.get('/', authenticateToken, getAllGroups);
grupRouter.get('/:id', authenticateToken, getGroupById);
grupRouter.post('/', authenticateToken, createGroup);
grupRouter.put('/:id', authenticateToken, updateGroup);
grupRouter.delete('/:id', authenticateToken, deleteGroup);

module.exports = { grupRouter };