const modelo = require('../../modelo/cliente/VerMesasCliModelo');

class VerMesasCliControlador {
    static async verMesas(req, res) {
        const { idmesa } = req.query;

        try {
            let mesas;

            if (idmesa) {
                // 1. Si se proporciona un ID, busca esa mesa específica
                if (isNaN(idmesa)) {
                    return res.status(400).json({ error: 'El ID de la mesa debe ser numérico.' });
                }
                mesas = await modelo.obtenerMesaPorId(idmesa);
            } else {
                // 2. Por defecto, lista todas las mesas disponibles
                mesas = await modelo.obtenerMesasDisponibles();
            }

            // Si no hay resultados
            if (!mesas || mesas.length === 0) {
                return res.status(200).json({ 
                    mensaje: 'No hay mesas disponibles en este momento.', 
                    datos: [] 
                });
            }

            // Respuesta exitosa
            return res.status(200).json({
                mensaje: 'Mesas consultadas con éxito.',
                total: mesas.length,
                datos: mesas
            });

        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor: ' + err.message });
        }
    }
}

module.exports = VerMesasCliControlador;