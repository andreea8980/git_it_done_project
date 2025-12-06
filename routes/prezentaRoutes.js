const express = require('express');
const prezentaRouter = express.Router();
const { createPrezenta, getPrezenteEveniment } = require('../controllers/prezentaControllers');

prezentaRouter.post('/', createPrezenta);

prezentaRouter.get('/eveniment/:id',getPrezenteEveniment);

module.exports = { prezentaRouter };