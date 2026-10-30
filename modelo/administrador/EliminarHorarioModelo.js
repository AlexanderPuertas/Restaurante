const dbService = require('../bd/Conexion');

class EliminarHorarioModelo {
    // Buscar si el horario existe antes de intentar eliminarlo 
    static async buscarPorId(idturnos) {
        const query = 'SELECT * FROM turnos_atencion WHERE idturnos = ?';
        try {
            const filas = await dbService.query(query, [idturnos]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al buscar horario: ${err.message}`);
        }
    }

    // Eliminación del horario preservando integridad referencial
    static async eliminarHorario(idturnos) {
        const queryReg = 'DELETE FROM turnos_atencion WHERE idturnos = ?';
        const queryHorario = 'DELETE FROM turnos_atencion WHERE idturnos = ?';

        try {
            await dbService.query(queryReg, [idturnos]);
            return await dbService.query(queryHorario, [idturnos]);
        } catch (err) {
            throw new Error(`Error al eliminar horario: ${err.message}`);
        }
    }
}

module.exports = EliminarHorarioModelo;