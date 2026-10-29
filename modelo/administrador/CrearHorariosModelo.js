const conexion = require('../bd/Conexion');

class CrearHorariosModelo {
    static async crearTurno(turnoData) {
        const { nombre_turno, dia_semana, hora_inicio, hora_fin, estado, capacidad_maxima } = turnoData;
        
        const query = `
            INSERT INTO turnos_atencion (nombre_turno, dia_semana, hora_inicio, hora_fin, estado, capacidad_maxima) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Llamamos al método query de tu clase Conexion
        const resultado = await conexion.query(query, [
            nombre_turno, 
            dia_semana, 
            hora_inicio, 
            hora_fin, 
            estado, 
            capacidad_maxima
        ]);

        return resultado;
    }
}

module.exports = CrearHorariosModelo;