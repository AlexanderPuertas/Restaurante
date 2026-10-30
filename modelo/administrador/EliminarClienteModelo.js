const dbService = require('../bd/Conexion');

class EliminarClienteModelo {
    // Buscar si el cliente existe antes de intentar eliminarlo 
    static async buscarPorCorreo(correo) {
        const query = 'SELECT * FROM clientes WHERE correo = ?';
        try {
            const filas = await dbService.query(query, [correo]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al buscar cliente: ${err.message}`);
        }
    }

    // Eliminación del cliente preservando integridad referencial
    static async eliminarCliente(correo) {
        const query = 'DELETE FROM clientes WHERE correo = ?';

        try {
            await dbService.query(query, [correo]);
            return { mensaje: 'Cliente eliminado correctamente.' };
        } catch (err) {
            throw new Error(`Error al eliminar cliente: ${err.message}`);
        }
    }
}

module.exports = EliminarClienteModelo;