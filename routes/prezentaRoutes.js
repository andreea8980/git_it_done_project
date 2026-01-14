const express = require('express');
const prezentaRouter = express.Router();
const { createPrezenta, getPrezenteEveniment } = require('../controllers/prezentaControllers');

// importam middleware de auth
const { authenticateToken } = require('../middleware/auth');

// createPrezenta ramane neprotejat pentru a permite inregistrarea prezentei fara autentificare
prezentaRouter.post('/', createPrezenta);

// protejat pt ca e doar pt organizatori
prezentaRouter.get('/eveniment/:id', authenticateToken, getPrezenteEveniment);

module.exports = { prezentaRouter };