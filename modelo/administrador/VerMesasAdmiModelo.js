const dbService = require('../bd/Conexion'); 

class VerMesasAdmiModelo {
    // Listar todas las mesas disponibles
    static async obtenerMesasDisponibles() {
        const query = `
            SELECT 
                idmesa,
                numero_mesa,
                capacidad,
                ubicacion,
                estado
            FROM mesas
            WHERE estado IN ('disponible', 'ocupada')
            ORDER BY numero_mesa ASC
        `;
        try {
            return await dbService.query(query);
        } catch (err) {
            throw new Error(`Error al consultar las mesas : ${err.message}`);
        }
    }

    // Consultar una mesa específica por su ID
    static async obtenerMesaPorId(idmesa) {
        const query = `
            SELECT 
                idmesa,
                numero_mesa,
                capacidad,
                ubicacion,
                estado
            FROM mesas
            WHERE idmesa = ?
        `;
        try {
            const resultados = await dbService.query(query, [idmesa]);
            return resultados;
        } catch (err) {
            throw new Error(`Error al consultar la mesa específica: ${err.message}`);
        }
    }
}

module.exports = VerMesasAdmiModelo;