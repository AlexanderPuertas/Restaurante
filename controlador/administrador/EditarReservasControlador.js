const modelo = require('../../modelo/administrador/EditarReservasModelo');

const estadosPermitidos = new Map([
    ['pendiente', 'Pendiente'],
    ['confirmada', 'Confirmada'],
    ['en curso', 'En Curso'],
    ['completada', 'Completada'],
    ['cancelada', 'Cancelada']
]);

class EditarReservasControlador {
    static validarIdReserva(idReserva) {
        const id = Number(idReserva);
        return Number.isSafeInteger(id) && id > 0 ? id : null;
    }

    static esFechaValida(fecha) {
        if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return false;
        }

        const fechaParseada = new Date(`${fecha}T00:00:00.000Z`);
        return !Number.isNaN(fechaParseada.getTime()) &&
            fechaParseada.toISOString().slice(0, 10) === fecha;
    }

    static obtenerResultado(resultado, res) {
        if (resultado.resultado === 'no_encontrada') {
            return res.status(404).json({ error: 'La reserva no existe.' });
        }
        if (resultado.resultado === 'mesa_no_encontrada') {
            return res.status(404).json({ error: 'La mesa seleccionada no existe.' });
        }
        if (resultado.resultado === 'capacidad_insuficiente') {
            return res.status(400).json({
                error: 'La capacidad de la mesa es insuficiente para el número de personas.'
            });
        }
        if (resultado.resultado === 'conflicto') {
            return res.status(409).json({
                error: 'La mesa ya tiene una reserva activa en esa fecha y hora. Seleccione otro horario o una mesa disponible.'
            });
        }
        if (resultado.resultado === 'actualizada' || resultado.resultado === 'eliminada') {
            return null;
        }
        return res.status(500).json({
            error: 'El modelo devolvió un resultado no reconocido al procesar la reserva.'
        });
    }

    static async cambiarEstado(req, res) {
        const idReserva = EditarReservasControlador.validarIdReserva(req.params.idReserva);
        if (!idReserva) {
            return res.status(400).json({
                error: 'El ID de la reserva debe ser un entero positivo.'
            });
        }

        const valorEstado = req.body && req.body.estado;
        if (typeof valorEstado !== 'string') {
            return res.status(400).json({ error: 'El estado de la reserva es obligatorio.' });
        }
        const estado = estadosPermitidos.get(valorEstado.trim().toLowerCase());
        if (!estado) {
            return res.status(400).json({
                error: 'El estado debe ser Pendiente, Confirmada, En Curso, Completada o Cancelada.'
            });
        }

        try {
            const resultado = await modelo.cambiarEstado(idReserva, estado);
            const error = EditarReservasControlador.obtenerResultado(resultado, res);
            if (error) {
                return error;
            }
            return res.status(200).json({
                mensaje: 'Estado de la reserva actualizado correctamente.',
                idReserva,
                estado: resultado.estado
            });
        } catch (err) {
            return res.status(500).json({
                error: 'Error al cambiar el estado de la reserva: ' + err.message
            });
        }
    }

    static async editarReserva(req, res) {
        const idReserva = EditarReservasControlador.validarIdReserva(req.params.idReserva);
        if (!idReserva) {
            return res.status(400).json({
                error: 'El ID de la reserva debe ser un entero positivo.'
            });
        }

        const body = req.body || {};
        const fecha = body.fecha_reserva || body.fecha;
        const hora = body.hora_reserva || body.hora;
        const idMesa = Number(body.idmesa || body.idMesa);
        const numeroPersonas = body.numero_personas === undefined
            ? undefined
            : Number(body.numero_personas);

        if (
            !EditarReservasControlador.esFechaValida(fecha) ||
            typeof hora !== 'string' ||
            !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(hora) ||
            !Number.isSafeInteger(idMesa) ||
            idMesa <= 0 ||
            (numeroPersonas !== undefined &&
                (!Number.isSafeInteger(numeroPersonas) || numeroPersonas <= 0))
        ) {
            return res.status(400).json({
                error: 'Envía una fecha válida (YYYY-MM-DD), una hora válida (HH:mm), una mesa válida y, opcionalmente, un número entero positivo de personas.'
            });
        }

        try {
            const resultado = await modelo.actualizarReserva(idReserva, {
                fecha_reserva: fecha,
                hora_reserva: hora,
                idmesa: idMesa,
                numero_personas: numeroPersonas
            });
            const error = EditarReservasControlador.obtenerResultado(resultado, res);
            if (error) {
                return error;
            }
            return res.status(200).json({
                mensaje: 'Reserva actualizada correctamente.',
                idReserva,
                datos: resultado.datos
            });
        } catch (err) {
            return res.status(500).json({
                error: 'Error al editar la reserva: ' + err.message
            });
        }
    }

    static async eliminarReserva(req, res) {
        const idReserva = EditarReservasControlador.validarIdReserva(req.params.idReserva);
        if (!idReserva) {
            return res.status(400).json({
                error: 'El ID de la reserva debe ser un entero positivo.'
            });
        }

        try {
            const resultado = await modelo.eliminarReserva(idReserva);
            const error = EditarReservasControlador.obtenerResultado(resultado, res);
            if (error) {
                return error;
            }
            return res.status(200).json({
                mensaje: 'Reserva eliminada correctamente.',
                idReserva
            });
        } catch (err) {
            return res.status(500).json({
                error: 'Error al eliminar la reserva: ' + err.message
            });
        }
    }
}

module.exports = EditarReservasControlador;