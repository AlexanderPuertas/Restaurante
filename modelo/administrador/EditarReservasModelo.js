const dbService = require('../bd/Conexion');

class EditarReservasModelo {
    static estadosTerminales = ['cancelada', 'completada'];

    static async obtenerReserva(connection, idReserva) {
        const [reservas] = await connection.query(
            `SELECT idreserva, Idclientes, idmesa, fecha_reserva, hora_reserva, numero_personas, estado
             FROM reservas
             WHERE idreserva = ?
             FOR UPDATE`,
            [idReserva]
        );
        return reservas[0] || null;
    }

    static async bloquearMesas(connection, idsMesas) {
        const idsUnicos = [...new Set(idsMesas.map(Number).filter(Number.isSafeInteger))]
            .sort((a, b) => a - b);
        if (idsUnicos.length === 0) {
            return [];
        }

        const placeholders = idsUnicos.map(() => '?').join(', ');
        const [mesas] = await connection.query(
            `SELECT idmesa, capacidad
             FROM mesas
             WHERE idmesa IN (${placeholders})
             ORDER BY idmesa
             FOR UPDATE`,
            idsUnicos
        );
        return mesas;
    }

    static estadoOcupaMesa(estado) {
        return !this.estadosTerminales.includes(String(estado || '').toLowerCase());
    }

    static async reservaTieneConflicto(connection, idReserva, idMesa, fecha, hora) {
        const [reservas] = await connection.query(
            `SELECT idreserva
             FROM reservas
             WHERE idmesa = ?
               AND fecha_reserva = ?
               AND hora_reserva = ?
               AND idreserva <> ?
               AND LOWER(estado) NOT IN ('cancelada', 'completada')
             LIMIT 1
             FOR UPDATE`,
            [idMesa, fecha, hora, idReserva]
        );
        return reservas.length > 0;
    }

    static async recalcularEstadoMesas(connection, idsMesas) {
        const idsUnicos = [...new Set(idsMesas.map(Number).filter(Number.isSafeInteger))];
        for (const idMesa of idsUnicos) {
            const [reservasActivas] = await connection.query(
                `SELECT COUNT(*) AS total
                 FROM reservas
                 WHERE idmesa = ?
                   AND LOWER(estado) NOT IN ('cancelada', 'completada')`,
                [idMesa]
            );
            const estado = Number(reservasActivas[0].total) > 0 ? 'ocupada' : 'disponible';
            await connection.query(
                'UPDATE mesas SET estado = ? WHERE idmesa = ?',
                [estado, idMesa]
            );
        }
    }

    static async cambiarEstado(idReserva, nuevoEstado) {
        return dbService.transaction(async connection => {
            const reserva = await this.obtenerReserva(connection, idReserva);
            if (!reserva) {
                return { resultado: 'no_encontrada' };
            }

            await this.bloquearMesas(connection, [reserva.idmesa]);
            if (
                this.estadoOcupaMesa(nuevoEstado) &&
                await this.reservaTieneConflicto(
                    connection,
                    idReserva,
                    reserva.idmesa,
                    reserva.fecha_reserva,
                    reserva.hora_reserva
                )
            ) {
                return { resultado: 'conflicto' };
            }

            await connection.query(
                'UPDATE reservas SET estado = ? WHERE idreserva = ?',
                [nuevoEstado, idReserva]
            );
            await this.recalcularEstadoMesas(connection, [reserva.idmesa]);
            return { resultado: 'actualizada', estado: nuevoEstado };
        });
    }

    static async actualizarReserva(idReserva, datos) {
        return dbService.transaction(async connection => {
            const reserva = await this.obtenerReserva(connection, idReserva);
            if (!reserva) {
                return { resultado: 'no_encontrada' };
            }

            const mesas = await this.bloquearMesas(connection, [reserva.idmesa, datos.idmesa]);
            const mesaNueva = mesas.find(mesa => Number(mesa.idmesa) === datos.idmesa);
            if (!mesaNueva) {
                return { resultado: 'mesa_no_encontrada' };
            }

            const numeroPersonas = datos.numero_personas === undefined
                ? Number(reserva.numero_personas)
                : datos.numero_personas;
            if (Number(mesaNueva.capacidad) < numeroPersonas) {
                return { resultado: 'capacidad_insuficiente' };
            }

            if (
                this.estadoOcupaMesa(reserva.estado) &&
                await this.reservaTieneConflicto(
                    connection,
                    idReserva,
                    datos.idmesa,
                    datos.fecha_reserva,
                    datos.hora_reserva
                )
            ) {
                return { resultado: 'conflicto' };
            }

            await connection.query(
                `UPDATE reservas
                 SET fecha_reserva = ?, hora_reserva = ?, idmesa = ?, numero_personas = ?
                 WHERE idreserva = ?`,
                [datos.fecha_reserva, datos.hora_reserva, datos.idmesa, numeroPersonas, idReserva]
            );
            await this.recalcularEstadoMesas(connection, [reserva.idmesa, datos.idmesa]);

            return {
                resultado: 'actualizada',
                datos: {
                    fecha_reserva: datos.fecha_reserva,
                    hora_reserva: datos.hora_reserva,
                    idmesa: datos.idmesa,
                    numero_personas: numeroPersonas
                }
            };
        });
    }

    static async eliminarReserva(idReserva) {
        return dbService.transaction(async connection => {
            const reserva = await this.obtenerReserva(connection, idReserva);
            if (!reserva) {
                return { resultado: 'no_encontrada' };
            }

            await this.bloquearMesas(connection, [reserva.idmesa]);
            await connection.query(
                'DELETE FROM reservas WHERE idreserva = ?',
                [idReserva]
            );
            await this.recalcularEstadoMesas(connection, [reserva.idmesa]);
            return { resultado: 'eliminada' };
        });
    }
}

module.exports = EditarReservasModelo;