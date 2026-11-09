// modelo/cliente/ReservarMesaModelo.js
const db = require('../bd/Conexion');

class ReservarMesaModelo {

  // 1. Validar que la mesa exista, tenga capacidad suficiente y esté disponible
  async validarMesa(idMesa, numPersonas) {
    try {
      const mesas = await db.query('SELECT * FROM mesas WHERE idmesa = ?', [idMesa]);
      if (mesas.length === 0) {
        throw new Error('La mesa seleccionada no existe.');
      }
      
      const mesa = mesas[0];

      // Regla de negocio 2: Capacidad suficiente (CA-02)
      if (mesa.capacidad < numPersonas) {
        throw new Error('La capacidad de la mesa es insuficiente para el número de personas (CA-02).');
      }

      // Validar si la mesa está libre
      if (mesa.estado !== 'disponible') {
        throw new Error('La mesa seleccionada ya se encuentra ocupada o reservada (CA-03).');
      }

      return mesa;
    } catch (error) {
      throw error;
    }
  }

  // 2. Validar que la hora esté dentro de los turnos de atención disponibles
  async validarTurnoYHorario(hora) {
    try {
      // Consultamos los turnos activos en turnos_atencion
      const turnos = await db.query('SELECT * FROM turnos_atencion WHERE estado = 1');
      if (turnos.length === 0) {
        throw new Error('No hay turnos de atención activos en este momento.');
      }

      // Verificamos si la hora de la reserva se encuentra dentro de algún rango de turno (hora_inicio - hora_fin)
      const turnoValido = turnos.some(turno => {
        return hora >= turno.hora_inicio && hora <= turno.hora_fin;
      });

      if (!turnoValido) {
        throw new Error('La hora seleccionada no se encuentra dentro de ningún turno de atención disponible.');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // 3. Crear la reserva (Actualiza el estado de la mesa a ocupada/reservada)
  async crearReserva(idMesa, idCliente, fecha, hora, numPersonas, notas = '') {
    try {
      // Validar mesa y capacidad
      await this.validarMesa(idMesa, numPersonas);

      // Validar turno de atención
      await this.validarTurnoYHorario(hora);

      // Bloquear / actualizar el estado de la mesa en la tabla 'mesas' (Regla de negocio 4 / CA-01)
      const updateQuery = `
        UPDATE mesas 
        SET estado = 'ocupada' 
        WHERE idmesa = ?
      `;
      await db.query(updateQuery, [idMesa]);

      return {
        success: true,
        mensaje: 'Reserva registrada exitosamente y mesa bloqueada (CA-01).',
        detalles: {
          idMesa,
          idCliente,
          fecha,
          hora,
          numeroPersonas: numPersonas,
          notas,
          estadoMesa: 'ocupada'
        }
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReservarMesaModelo;