const dbService = require('../bd/Conexion');

class ReservasModelo {
    static async obtenerReservasPorCliente(idCliente) {
        const query = 'SELECT * FROM reservas WHERE idclientes = ?';

        try {
            return await dbService.query(query, [idCliente]);
        } catch (err) {
            throw new Error(`Error al consultar las reservas del cliente: ${err.message}`);
        }
    }
}

module.exports = ReservasModelo;