const express = require('express');

const crearClienteCtrl= require('../../controlador/administrador/CrearClienteControladorAdmi');//Rf01
const crearAdminCtrl = require('../../controlador/administrador/CrearAdminControladorAdmi'); // RF16
const verturnosClienteCtrl = require('../../controlador/administrador/VerHorariosYTurnosControlador');
const editarhorariosCtrl = require('../../controlador/administrador/EditarHorariosControlador');
const crearhorariosCtrl = require('../../controlador/administrador/CrearHorariosControlador');
const eliminarhorariosCtrl = require('../../controlador/administrador/EliminarHorarioControlador');
const eliminarclienteCtrl = require('../../controlador/administrador/EliminarClienteControlador');
const crearmesaCtrl = require('../../controlador/administrador/CrearMesaControlador');
const editarmesasCtrl = require('../../controlador/administrador/EditarMesaControlador');
const eliminarmesaCtrl = require('../../controlador/administrador/EliminarMesaControlador');
const vermesasCtrl = require('../../controlador/administrador/VerMesasAdmiControlador');
const verReservasCtrl = require('../../controlador/administrador/VerReservasControlador');
const editarReservasCtrl = require('../../controlador/administrador/EditarReservasControlador');


const router = express.Router();



router.post('/seguridad-crearCliente', crearClienteCtrl.crearCliente); // RF01
router.post('/crear-administrador', crearAdminCtrl.crearAdmin); // RF16
router.post('/registro-administrador', crearAdminCtrl.crearAdmin); // RF16 (Alias)
router.get('/horarios-turnos', verturnosClienteCtrl.verHorarios); //RF05
router.put('/editar-horario/:idturnos', editarhorariosCtrl.editar); //RF06
router.post('/crear-horario', crearhorariosCtrl.crear); //RF06
router.delete('/eliminar-horario/:idturnos', eliminarhorariosCtrl.eliminar); //RF07
router.delete('/eliminar-cliente/:correo', eliminarclienteCtrl.eliminar); //RF08
router.post('/crear-mesa', crearmesaCtrl.crearMesa); //RF09
router.put('/editar-mesa/:idmesa', editarmesasCtrl.editar); //RF09
router.delete('/eliminar-mesa/:idmesa', eliminarmesaCtrl.eliminar); //RF09
router.get('/ver-mesasadmi/', vermesasCtrl.verMesas); //RF10
router.get('/ver-reservas', verReservasCtrl.verReservas); //RF14
router.put('/reservas-admi/:idReserva/estado', editarReservasCtrl.cambiarEstado); //RF15
router.put('/reservas-admi/:idReserva', editarReservasCtrl.editarReserva); //RF15
router.delete('/reservas-admi/:idReserva', editarReservasCtrl.eliminarReserva); //RF15


module.exports = router;