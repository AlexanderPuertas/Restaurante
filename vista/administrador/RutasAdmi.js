const express = require('express');

const crearClienteCtrl= require('../../controlador/administrador/CrearClienteControladorAdmi');//Rf01
const turnosClienteCtrl = require('../../controlador/administrador/VerHorariosYTurnosControlador');




const router = express.Router();

router.post('/seguridad-crearCliente', crearClienteCtrl.crearCliente); // RF01
router.get('/horarios-turnos', turnosClienteCtrl.verHorarios); //RF05
module.exports = router;