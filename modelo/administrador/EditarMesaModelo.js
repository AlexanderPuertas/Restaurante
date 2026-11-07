const dbService = require('../bd/Conexion'); 

class EditarMesaModelo {
    // Buscar mesa por su ID
    static async buscarPorId(idmesa) {
        const query = 'SELECT * FROM mesas WHERE idmesa = ?';
        try {
            const filas = await dbService.query(query, [idmesa]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al buscar mesa: ${err.message}`);
        }
    }

    // Actualizar datos de la mesa por parte del Administrador
    static async actualizarMesa(idmesa, numero_mesa, capacidad, ubicacion, estado) {
        const query = `
            UPDATE mesas 
            SET numero_mesa = ?, capacidad = ?, ubicacion = ?, estado = ?
            WHERE idmesa = ?
        `;
        try {
            return await dbService.query(query, [numero_mesa, capacidad, ubicacion, estado, idmesa]);
        } catch (err) {
            throw new Error(`Error al actualizar mesa: ${err.message}`);
        }
    }
}

module.exports = EditarMesaModelo;