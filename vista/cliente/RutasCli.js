const express = require('express');

const crearClienteCtrl = require('../../controlador/cliente/CrearClienteControladorCli');
const loginClienteCtrl = require('../../controlador/cliente/LoginClienteControlador');
const turnosClienteCtrl = require('../../controlador/cliente/VerHorariosYTurnosControlador');
const vermesasCtrl = require('../../controlador/cliente/VerMesasCliControlador');
const reservarmesaCtrl = require('../../controlador/cliente/ReservarMesaControlador');
const reservasCtrl = require('../../controlador/cliente/ReservasControlador');


const router = express.Router();

router.post('/registro-cliente', crearClienteCtrl.crearCliente); // RF02
router.post('/login-cliente', loginClienteCtrl.login); // RF03
router.get('/horarios-turnos', turnosClienteCtrl.verHorarios); // RF04
router.get('/ver-mesascliente', vermesasCtrl.verMesas); // RF10
router.post('/reservar-mesa', reservarmesaCtrl.reservarMesa); // RF11
router.get('/mis-reservas', reservasCtrl.verReservas); // RF12
module.exports = router;