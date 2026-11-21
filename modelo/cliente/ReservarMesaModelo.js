const db = require('../bd/Conexion');
const LiberadorMesasServicio = require('../../servicios/LiberadorMesasServicio');

class ReservarMesaModelo {

  // Validar si una mesa ya tiene reserva activa en esa fecha y hora
  async estaDisponible(idMesa, fecha, hora) {
    try {
      const rows = await db.query(
        "SELECT COUNT(*) as total FROM reservas WHERE idmesa = ? AND fecha_reserva = ? AND hora_reserva = ? AND estado != 'Cancelada'",
        [idMesa, fecha, hora]
      );
      return rows[0].total === 0;
    } catch (error) {
      throw error;
    }
  }

  // 1. Validar que la mesa exista, tenga capacidad suficiente y esté disponible
  async validarMesa(idMesa, numPersonas, fecha = null, hora = null) {
    try {
      // Antes de validar la mesa, limpiamos automáticamente reservas vencidas (> 2 horas)
      await LiberadorMesasServicio.liberarMesasVencidas();

      const mesas = await db.query('SELECT * FROM mesas WHERE idmesa = ?', [idMesa]);
      if (mesas.length === 0) {
        throw new Error('La mesa seleccionada no existe.');
      }
      
      const mesa = mesas[0];

      // Regla de negocio 2: Capacidad suficiente (CA-02)
      if (mesa.capacidad < numPersonas) {
        throw new Error(`La capacidad de la mesa (${mesa.capacidad} personas) es insuficiente para ${numPersonas} personas (CA-02).`);
      }

      // Validar si la mesa está libre en la fecha/hora específica
      if (fecha && hora) {
        const libre = await this.estaDisponible(idMesa, fecha, hora);
        if (!libre) {
          throw new Error('La mesa seleccionada ya se encuentra reservada en esa fecha y hora.');
        }
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
        const horarios = turnos.map(t => `${t.nombre_turno} (${t.hora_inicio} a ${t.hora_fin})`).join(' | ');
        throw new Error(`La hora seleccionada (${hora}) no se encuentra dentro de ningún turno de atención disponible. Turnos válidos: ${horarios}.`);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // 3. Crear la reserva (Inserta en la BD y actualiza la mesa)
  async crearReserva(idMesa, Idclientes, fecha, hora, numPersonas, notas = '') {
    try {
      // Validar mesa, capacidad y disponibilidad
      await this.validarMesa(idMesa, numPersonas, fecha, hora);

      // Validar turno de atención
      await this.validarTurnoYHorario(hora);

      // A. INSERTAR LA RESERVA EN LA TABLA `reservas`
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
        idreserva: idReservaGenerada,
        idMesa: Number(idMesa),
        Idclientes: Number(Idclientes),
        fecha,
        hora,
        numeroPersonas: Number(numPersonas),
        notas,
        estadoReserva: 'pendiente',
        estadoMesa: 'ocupada'
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReservarMesaModelo;
