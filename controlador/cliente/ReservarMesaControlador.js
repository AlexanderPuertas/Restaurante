// controlador/cliente/ReservarMesaControlador.js
const ReservarMesaModelo = require('../../modelo/cliente/ReservarMesaModelo');

class ReservarMesaControlador {
  constructor() {
    this.modelo = new ReservarMesaModelo();
  }

  // Validar disponibilidad de la mesa
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

  // Registrar la reserva
  reservarMesa = async (req, res) => {
    try {
      // Ajustado para capturar Idclientes con la estructura real de tu BD
      const Idclientes = req.user ? (req.user.Idclientes || req.user.idCliente) : req.body.Idclientes; 
      const { idMesa, fecha, hora, numPersonas, notas } = req.body;

      if (!Idclientes) {
        return res.status(400).json({
          success: false,
          error: 'No se encontró el identificador del cliente en la sesión o petición.'
        });
      }

      // Validar que no sean fechas u horas pasadas
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
        Idclientes, 
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