const modelo = require('../../modelo/administrador/VerReservasModelo');

class VerReservasControlador {
    static esFechaValida(fecha) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return false;
        }

        const fechaParseada = new Date(`${fecha}T00:00:00.000Z`);
        return !Number.isNaN(fechaParseada.getTime()) &&
            fechaParseada.toISOString().slice(0, 10) === fecha;
    }

    static async verReservas(req, res) {
        const filtros = {};
        const parametros = ['fecha', 'fechaDesde', 'fechaHasta', 'estado', 'cliente'];

        for (const parametro of parametros) {
            const valor = req.query[parametro];
            if (valor === undefined) {
                continue;
            }
            if (typeof valor !== 'string') {
                return res.status(400).json({
                    error: `El filtro "${parametro}" debe tener un único valor de texto.`
                });
            }

            const valorLimpio = valor.trim();
            if (valorLimpio) {
                filtros[parametro] = valorLimpio;
            }
        }

        for (const parametro of ['fecha', 'fechaDesde', 'fechaHasta']) {
            if (filtros[parametro] && !VerReservasControlador.esFechaValida(filtros[parametro])) {
                return res.status(400).json({
                    error: `El filtro "${parametro}" debe tener el formato YYYY-MM-DD y ser una fecha válida.`
                });
            }
        }

        if (
            filtros.fechaDesde &&
            filtros.fechaHasta &&
            filtros.fechaDesde > filtros.fechaHasta
        ) {
            return res.status(400).json({
                error: 'La fecha inicial no puede ser posterior a la fecha final.'
            });
        }

        try {
            const reservas = await modelo.obtenerReservas(filtros);
            return res.status(200).json({
                mensaje: 'Reservas consultadas con éxito.',
                total: reservas.length,
                datos: reservas
            });
        } catch (err) {
            return res.status(500).json({
                error: 'Error al consultar las reservas: ' + err.message
            });
        }
    }
}

module.exports = VerReservasControlador;