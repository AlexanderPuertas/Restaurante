const db = require('../bd/Conexion'); 

class EditarReservasModelo {
    
    // Obtener una reserva por su ID
    static async obtenerReservaPorId(idReserva) {
        const rows = await db.query(
            "SELECT idreserva, Idclientes, idmesa, fecha_reserva, hora_reserva, numero_personas, estado FROM reservas WHERE idreserva = ?",
            [idReserva]
        );
        return rows[0] || null;
    }

    // Cambiar estado de la reserva (ej. 'Cancelada')
    static async cambiarEstado(idReserva, nuevoEstado) {
        const result = await db.query(
            "UPDATE reservas SET estado = ? WHERE idreserva = ?",
            [nuevoEstado, idReserva]
        );
        return (result.affectedRows > 0 || result.changedRows > 0);
    }

    // Actualizar datos de la reserva al editar
    static async actualizarDatos(idReserva, nuevaFecha, nuevaHora, idNuevaMesa, numeroPersonas) {
        const result = await db.query(
            "UPDATE reservas SET fecha_reserva = ?, hora_reserva = ?, idmesa = ?, numero_personas = ? WHERE idreserva = ?",
            [nuevaFecha, nuevaHora, idNuevaMesa, numeroPersonas, idReserva]
        );
        return (result.affectedRows > 0 || result.changedRows > 0);
    }

    // Verificar si una mesa está disponible en fecha y hora (excluyendo la reserva actual si se pasa)
    static async verificarDisponibilidadMesa(idMesa, fecha, hora, idReservaExcluir = null) {
        let sql = "SELECT COUNT(*) as total FROM reservas WHERE idmesa = ? AND fecha_reserva = ? AND hora_reserva = ? AND estado != 'Cancelada'";
        const params = [idMesa, fecha, hora];

        if (idReservaExcluir) {
            sql += " AND idreserva != ?";
            params.push(idReservaExcluir);
        }

        const rows = await db.query(sql, params);
        return rows[0].total === 0;
    }

    // Liberar una mesa (cambiar estado en tabla mesas si aplica)
    static async liberarMesa(idMesa) {
        if (!idMesa) return false;
        const result = await db.query(
            "UPDATE mesas SET estado = 'disponible' WHERE idmesa = ?",
            [idMesa]
        );
        return result.affectedRows > 0;
    }

    // Ocupar una mesa nueva
    static async ocuparMesa(idMesa) {
        if (!idMesa) return false;
        const result = await db.query(
            "UPDATE mesas SET estado = 'ocupada' WHERE idmesa = ?",
            [idMesa]
        );
        return result.affectedRows > 0;
    }
}

module.exports = EditarReservasModelo;