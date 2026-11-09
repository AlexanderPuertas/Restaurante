// controlador/cliente/ReservarMesaControlador.js
const ReservarMesaModelo = require('../../modelo/cliente/ReservarMesaModelo');

class ReservarMesaControlador {
  constructor() {
    this.modelo = new ReservarMesaModelo();
  }

  // Convertido a función flecha para preservar el contexto de 'this'
  validarDisponibilidadMesa = async (req, res) => {
    try {
      const { idMesa, fecha, hora } = req.query;
      const disponible = await this.modelo.estaDisponible(idMesa, fecha, hora);
      
      return res.status(200).json({
        success: true,
        disponible,
        mensaje: disponible ? 'Mesa disponible' : 'La mesa ya se encuentra reservada en este horario.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Convertido a función flecha para que funcione perfectamente con tu router.js
  reservarMesa = async (req, res) => {
    try {
      const idCliente = req.user ? req.user.idCliente : req.body.idCliente; 
      const { idMesa, fecha, hora, numPersonas, notas } = req.body;

      // Validar que no sean fechas u horas pasadas (Regla de negocio 3)
      const fechaReserva = new Date(`${fecha}T${hora}`);
      if (fechaReserva < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'No se permite registrar reservas para fechas u horas pasadas.'
        });
      }

      // Ejecutar la creación de la reserva a través del modelo
      const nuevaReserva = await this.modelo.crearReserva(
        idMesa, 
        idCliente, 
        fecha, 
        hora, 
        numPersonas, 
        notas
      );

      return res.status(201).json({
        success: true,
        mensaje: 'Reserva registrada exitosamente (CA-01).',
        data: nuevaReserva
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ReservarMesaControlador();