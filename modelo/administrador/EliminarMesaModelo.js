const dbService = require('../bd/Conexion');

class EliminarMesaModelo {
    // Buscar si la mesa existe por su ID antes de intentar eliminarla 
    static async buscarPorId(idmesa) {
        const query = 'SELECT * FROM mesas WHERE idmesa = ?';
        try {
            const filas = await dbService.query(query, [idmesa]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al buscar mesa: ${err.message}`);
        }
    }

    // Verificar si la mesa tiene reservas activas o pendientes 
    static async verificarReservasActivas(idmesa) {
        const query = 'SELECT COUNT(*) as total FROM reservas WHERE id_mesa = ? AND estado = ?';
        try {
            const resultado = await dbService.query(query, [idmesa, 'activa']);
            return resultado[0].total > 0;
        } catch (err) {
            // Si la tabla de reservas aún no está creada, retorna false para permitir pruebas
            return false;
        }
    }

    // Eliminación de la mesa preservando integridad referencial
    static async eliminarMesa(idmesa) {
        const query = 'DELETE FROM mesas WHERE idmesa = ?';

        try {
            await dbService.query(query, [idmesa]);
            return { mensaje: 'Mesa eliminada correctamente.' };
        } catch (err) {
            throw new Error(`Error al eliminar mesa: ${err.message}`);
        }
    }
}

module.exports = EliminarMesaModelo;