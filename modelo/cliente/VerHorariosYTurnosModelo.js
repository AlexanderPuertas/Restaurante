const dbService = require('../bd/Conexion'); // Asegúrate de que la ruta a tu archivo de conexión sea correcta

class VerHorariosYTurnosModelo {
    // Listar todos los turnos activos y disponibles del restaurante
    static async obtenerTurnosDisponibles() {
        const query = `
            SELECT 
                idturnos,
                nombre_turno,
                hora_inicio,
                hora_fin,
                estado,
                capacidad_maxima
            FROM turnos_atencion
            WHERE estado = 1
            ORDER BY hora_inicio ASC
        `;
        try {
            return await dbService.query(query);
        } catch (err) {
            throw new Error(`Error al consultar los turnos disponibles: ${err.message}`);
        }
    }

    // Consultar un turno específico por su ID (para cuando el controlador llama a obtenerTurnPorTurno)
    static async obtenerTurnPorTurno(idturnos) {
        const query = `
            SELECT 
                idturnos,
                nombre_turno,
                hora_inicio,
                hora_fin,
                estado,
                capacidad_maxima
            FROM turnos_atencion
            WHERE idturnos = ? AND estado = 1
        `;
        try {
            const resultados = await dbService.query(query, [idturnos]);
            return resultados;
        } catch (err) {
            throw new Error(`Error al consultar el turno específico: ${err.message}`);
        }
    }
}

module.exports = VerHorariosYTurnosModelo;