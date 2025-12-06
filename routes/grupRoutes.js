const express = require('express');
const grupRouter = express.Router();
const {getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup} = require('../controllers/grupControllers');

grupRouter.get('/',getAllGroups);
grupRouter.get('/:id', getGroupById);

grupRouter.post('/', createGroup);

grupRouter.put('/:id',updateGroup);

grupRouter.delete('/:id',deleteGroup);

module.exports = { grupRouter };