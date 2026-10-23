const express = require('express');
// Asegúrate de que suba los niveles correctos. Si 'controlador' está al mismo nivel que 'vista':
const CRutas = require('../../../controlador/administrador/CrearClienteControladorAdmi');

const router = express.Router();

router.post('/seguridad/crearCliente', CRutas.crearCliente); // RF01

module.exports = router;