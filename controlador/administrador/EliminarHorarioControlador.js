const modelo = require('../../modelo/administrador/EliminarHorarioModelo');

class EliminarHorarioControlador {
    static async eliminar(req, res) {
        const { idturnos } = req.params;

        if (!idturnos || isNaN(idturnos)) {
            return res.status(400).json({ error: 'El ID del turno es obligatorio y debe ser numérico.' });
        }

        try {
            // Validar existencia previa (RN-03 / CA-06)
            const horario = await modelo.buscarPorId(idturnos);
            if (!horario) {
                return res.status(404).json({ error: 'El turno no existe o ya fue eliminado del sistema.' });
            }

            await modelo.eliminarHorario(idturnos);

            res.status(200).json({
                mensaje: 'Turno eliminado correctamente por el administrador.',
                idTurnoEliminado: Number(idturnos)
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor al eliminar el turno: ' + err.message });
        }
    }
}

module.exports = EliminarHorarioControlador;