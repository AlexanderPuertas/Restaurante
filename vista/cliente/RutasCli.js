const express = require('express');

const CRutas = require('../../controlador/cliente/CrearClienteControladorCli');//Rf01





const router = express.Router();

router.post('/seguridad/crearCliente', CRutas.crearCliente); // RF01

module.exports = router;