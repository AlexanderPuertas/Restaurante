const dbService = require('../bd/Conexion');

class EditarHorariosModelo {
    // Buscar horario por su ID
    static async buscarPorId(idturnos) {
        const query = 'SELECT * FROM turnos_atencion WHERE idturnos = ?';
        try {
            const filas = await dbService.query(query, [idturnos]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al buscar horario: ${err.message}`);
        }
    }

    // Actualizar datos del horario por parte del Administrador
    static async actualizarHorario(idturnos, nombre_turno, dia_semana, hora_inicio, hora_final, estado, capacidad_maxima) {
        const query = `
            UPDATE turnos_atencion 
            SET nombre_turno = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?, estado = ?, capacidad_maxima = ?
            WHERE idturnos = ?
        `;
        try {
            return await dbService.query(query, [nombre_turno, dia_semana, hora_inicio, hora_final, estado, capacidad_maxima, idturnos]);
        } catch (err) {
            throw new Error(`Error al actualizar horario: ${err.message}`);
        }
    }
}

module.exports = EditarHorariosModelo;