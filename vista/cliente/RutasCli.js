const express = require('express');

const crearClienteCtrl = require('../../controlador/cliente/CrearClienteControladorCli');
const loginClienteCtrl = require('../../controlador/cliente/LoginClienteControlador');
const turnosClienteCtrl = require('../../controlador/cliente/VerHorariosYTurnosControlador');


const router = express.Router();

router.post('/registro-cliente', crearClienteCtrl.crearCliente);
router.post('/login-cliente', loginClienteCtrl.login);
router.get('/horarios-turnos', turnosClienteCtrl.verHorarios);

module.exports = router;