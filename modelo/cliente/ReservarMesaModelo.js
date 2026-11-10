
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

      // Validar si la mesa está libre (puedes ajustar 'ocupada' o 'disponible' según lo manejes)
      if (mesa.estado === 'ocupada') {
        throw new Error('La mesa seleccionada ya se encuentra ocupada (CA-03).');
      }

      return mesa;
    } catch (error) {
      throw error;
    }
  }

  // 2. Validar que la hora esté dentro de los turnos de atención disponibles
  async validarTurnoYHorario(hora) {
    try {
      const turnos = await db.query('SELECT * FROM turnos_atencion WHERE estado = 1');
      if (turnos.length === 0) {
        throw new Error('No hay turnos de atención activos en este momento.');
      }

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

  // 3. Crear la reserva (Inserta en la BD y actualiza la mesa)
  async crearReserva(idMesa, Idclientes, fecha, hora, numPersonas, notas = '') {
    try {
      // Validar mesa y capacidad
      await this.validarMesa(idMesa, numPersonas);

      // Validar turno de atención
      await this.validarTurnoYHorario(hora);

      // A. INSERTAR LA RESERVA EN LA NUEVA TABLA `reservas`
      const insertQuery = `
        INSERT INTO reservas (Idclientes, idmesa, fecha_reserva, hora_reserva, numero_personas, estado, observaciones) 
        VALUES (?, ?, ?, ?, ?, 'pendiente', ?)
      `;
      const resultadoInsert = await db.query(insertQuery, [Idclientes, idMesa, fecha, hora, numPersonas, notas]);
      
      // Capturamos el ID de la reserva recién creada
      const idReservaGenerada = resultadoInsert.insertId;

      // B. Actualizar el estado de la mesa a 'ocupada' en la tabla 'mesas'
      const updateQuery = `
        UPDATE mesas 
        SET estado = 'ocupada' 
        WHERE idmesa = ?
      `;
      await db.query(updateQuery, [idMesa]);

      return {
        success: true,
        mensaje: 'Reserva registrada exitosamente y guardada en la base de datos (CA-01).',
        detalles: {
          idreserva: idReservaGenerada,
          idMesa,
          Idclientes,
          fecha,
          hora,
          numeroPersonas: numPersonas,
          notas,
          estadoReserva: 'pendiente',
          estadoMesa: 'ocupada'
        }
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReservarMesaModelo;