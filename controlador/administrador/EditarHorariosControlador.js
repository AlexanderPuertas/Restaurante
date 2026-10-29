const modelo = require('../../modelo/administrador/EditarHorariosModelo');

class EditarHorariosControlador {
    static async editar(req, res) {
        const { idturnos } = req.params;
        const { t1: nombre_turno, t2: dia_semana, t3: hora_inicio, t4: hora_final, t5: estado, t6: capacidad_maxima } = req.body;

        // Validaciones
        if (!idturnos || isNaN(idturnos)) {
            return res.status(400).json({ error: 'El ID del turno es obligatorio y debe ser numérico.' });
        }

        if (!nombre_turno || !dia_semana || !hora_inicio || !hora_final || !estado || !capacidad_maxima) {
            return res.status(400).json({ error: 'Todos los campos (nombre del turno, dia de la semana, hora de inicio, hora de finalización, estado, capacidad máxima) son obligatorios.' });
        }

       
        if (estado != '1' && estado != '0' && estado !== 'Activo' && estado !== 'Inactivo') {
            return res.status(400).json({ error: "El estado debe ser 'Activo', 'Inactivo', 1 o 0." });
        }

        try {
            const horario = await modelo.buscarPorId(idturnos);
            if (!horario) {
                return res.status(404).json({ error: 'El horario seleccionado no existe en el sistema.' });
            }

            await modelo.actualizarHorario(idturnos, nombre_turno, dia_semana, hora_inicio, hora_final, estado, capacidad_maxima);

            res.status(200).json({
                mensaje: 'Horario de atención actualizado correctamente por el administrador.',
                horario: {
                    idturnos: Number(idturnos),
                    nombre_turno,
                    dia_semana,
                    hora_inicio,
                    hora_final,
                    estado,
                    capacidad_maxima
                }
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor: ' + err.message });
        }
    }
}

module.exports = EditarHorariosControlador;