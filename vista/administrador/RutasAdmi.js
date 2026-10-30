const express = require('express');

const crearClienteCtrl= require('../../controlador/administrador/CrearClienteControladorAdmi');//Rf01
const verturnosClienteCtrl = require('../../controlador/administrador/VerHorariosYTurnosControlador');
const editarhorariosCtrl = require('../../controlador/administrador/EditarHorariosControlador');
const crearhorariosCtrl = require('../../controlador/administrador/CrearHorariosControlador');
const eliminarhorariosCtrl = require('../../controlador/administrador/EliminarHorarioControlador');



const router = express.Router();

router.post('/seguridad-crearCliente', crearClienteCtrl.crearCliente); // RF01
router.get('/horarios-turnos', verturnosClienteCtrl.verHorarios); //RF05
router.put('/editar-horario/:idturnos', editarhorariosCtrl.editar); //RF06
router.post('/crear-horario', crearhorariosCtrl.crear); //RF06
router.delete('/eliminar-horario/:idturnos', eliminarhorariosCtrl.eliminar); //RF07
module.exports = router;