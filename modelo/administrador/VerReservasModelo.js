const dbService = require('../bd/Conexion');

class VerReservasModelo {
    static async obtenerReservas(filtros = {}) {
        const condiciones = [];
        const parametros = [];

        if (filtros.fecha) {
            condiciones.push('r.fecha_reserva = ?');
            parametros.push(filtros.fecha);
        }

        if (filtros.fechaDesde) {
            condiciones.push('r.fecha_reserva >= ?');
            parametros.push(filtros.fechaDesde);
        }

        if (filtros.fechaHasta) {
            condiciones.push('r.fecha_reserva <= ?');
            parametros.push(filtros.fechaHasta);
        }

        if (filtros.estado) {
            condiciones.push('r.estado = ?');
            parametros.push(filtros.estado);
        }

        if (filtros.cliente) {
            condiciones.push('LOCATE(?, c.nombre) > 0');
            parametros.push(filtros.cliente);
        }

        const where = condiciones.length > 0
            ? `WHERE ${condiciones.join(' AND ')}`
            : '';
        const query = `
            SELECT
                r.idreserva,
                r.Idclientes AS idcliente,
                c.nombre AS nombre_cliente,
                c.telefono,
                r.fecha_reserva,
                r.hora_reserva,
                r.idmesa,
                m.numero_mesa,
                r.numero_personas,
                r.estado
            FROM reservas r
            LEFT JOIN clientes c ON c.idclientes = r.Idclientes
            LEFT JOIN mesas m ON m.idmesa = r.idmesa
            ${where}
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC, r.idreserva DESC
        `;

        try {
            return await dbService.query(query, parametros);
        } catch (err) {
            throw new Error(`Error al consultar todas las reservas: ${err.message}`);
        }
    }
}

module.exports = VerReservasModelo;