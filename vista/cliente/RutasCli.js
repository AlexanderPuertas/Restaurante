const express = require('express');

const crearClienteCtrl = require('../../controlador/cliente/CrearClienteControladorCli');
const loginClienteCtrl = require('../../controlador/cliente/LoginClienteControlador');

const router = express.Router();

router.post('/registro-cliente', crearClienteCtrl.crearCliente);
router.post('/login-cliente', loginClienteCtrl.login);

module.exports = router;