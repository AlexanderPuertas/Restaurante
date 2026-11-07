const express = require('express');

const crearClienteCtrl= require('../../controlador/administrador/CrearClienteControladorAdmi');//Rf01
const verturnosClienteCtrl = require('../../controlador/administrador/VerHorariosYTurnosControlador');
const editarhorariosCtrl = require('../../controlador/administrador/EditarHorariosControlador');
const crearhorariosCtrl = require('../../controlador/administrador/CrearHorariosControlador');
const eliminarhorariosCtrl = require('../../controlador/administrador/EliminarHorarioControlador');
const eliminarclienteCtrl = require('../../controlador/administrador/EliminarClienteControlador');
const crearmesaCtrl = require('../../controlador/administrador/CrearMesaControlador');
const editarmesasCtrl = require('../../controlador/administrador/EditarMesaControlador');
const eliminarmesaCtrl = require('../../controlador/administrador/EliminarMesaControlador');

const router = express.Router();

router.post('/seguridad-crearCliente', crearClienteCtrl.crearCliente); // RF01
router.get('/horarios-turnos', verturnosClienteCtrl.verHorarios); //RF05
router.put('/editar-horario/:idturnos', editarhorariosCtrl.editar); //RF06
router.post('/crear-horario', crearhorariosCtrl.crear); //RF06
router.delete('/eliminar-horario/:idturnos', eliminarhorariosCtrl.eliminar); //RF07
router.delete('/eliminar-cliente/:correo', eliminarclienteCtrl.eliminar); //RF08
router.post('/crear-mesa', crearmesaCtrl.crearMesa); //RF09
router.put('/editar-mesa/:idmesa', editarmesasCtrl.editar); //RF09
router.delete('/eliminar-mesa/:idmesa', eliminarmesaCtrl.eliminar); //RF09
module.exports = router;