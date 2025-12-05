const express = require('express');
const organizatorRouter = express.Router();
const {getAll, getOrganizatorById, register, login} = require('../controllers/orgControllers');

organizatorRouter.get('/',getAll);
organizatorRouter.get('/:id',getOrganizatorById);

organizatorRouter.post('/register', register);
organizatorRouter.post('/login', login);

module.exports = { organizatorRouter };
