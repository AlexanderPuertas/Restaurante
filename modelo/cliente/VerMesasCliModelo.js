const dbService = require('../bd/Conexion'); 

class VerMesasAdmiModelo {
    // Listar todas las mesas disponibles
    static async obtenerMesasDisponibles() {
        const query = `
            SELECT 
                
                numero_mesa,
                capacidad,
                ubicacion,
                estado
            FROM mesas
            WHERE estado IN ('disponible')
            ORDER BY numero_mesa ASC
        `;
        try {
            return await dbService.query(query);
        } catch (err) {
            throw new Error(`Error al consultar las mesas : ${err.message}`);
        }
    }

    
}

module.exports = VerMesasAdmiModelo;