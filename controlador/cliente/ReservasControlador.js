const modelo = require('../../modelo/cliente/ReservasModelo');

class ReservasControlador {
    static async verReservas(req, res) {
        const idCliente = req.user ? req.user.idCliente : req.query.idCliente;
        const idClienteNumerico = Number(idCliente);

        if (
            typeof idCliente !== 'string' && typeof idCliente !== 'number' ||
            !Number.isSafeInteger(idClienteNumerico) ||
            idClienteNumerico <= 0
        ) {
            return res.status(400).json({
                error: 'El ID del cliente es obligatorio y debe ser un número entero positivo.'
            });
        }

        try {
            const reservas = await modelo.obtenerReservasPorCliente(idClienteNumerico);
            const reservasActivas = reservas.filter(
                reserva => String(reserva.estado).toLowerCase() === 'activa'
            );
            const historial = reservas.filter(
                reserva => String(reserva.estado).toLowerCase() !== 'activa'
            );

            return res.status(200).json({
                mensaje: 'Reservas del cliente consultadas con éxito.',
                total: reservas.length,
                reservasActivas,
                historial
            });
        } catch (err) {
            return res.status(500).json({
                error: 'Error al consultar las reservas del cliente: ' + err.message
            });
        }
    }
}

module.exports = ReservasControlador;