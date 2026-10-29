const express = require('express');

const crearClienteCtrl = require('../../controlador/cliente/CrearClienteControladorCli');
const loginClienteCtrl = require('../../controlador/cliente/LoginClienteControlador');
const turnosClienteCtrl = require('../../controlador/cliente/VerHorariosYTurnosControlador');


const router = express.Router();

router.post('/registro-cliente', crearClienteCtrl.crearCliente); // RF02
router.post('/login-cliente', loginClienteCtrl.login); // RF03
router.get('/horarios-turnos', turnosClienteCtrl.verHorarios); // RF04

module.exports = router;