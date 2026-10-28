const modelo = require('../../modelo/administrador/VerHorariosYTurnosModelo');

class VerHorariosYTurnosControlador {
    static async verHorarios(req, res) {
        const { idturnos } = req.query; // Permite filtrar opcionalmente por query (?idturnos=1)

        try {
            let horarios;
            if (idturnos) {
                if (isNaN(idturnos)) {
                    return res.status(400).json({ error: 'El ID del turno debe ser numérico.' });
                }
                horarios = await modelo.obtenerTurnPorTurno(idturnos);
            } else {
                horarios = await modelo.obtenerTurnosDisponibles();
            }

            if (!horarios || horarios.length === 0) {
                return res.status(200).json({ 
                    mensaje: 'No hay turnos disponibles en este momento.', 
                    datos: [] 
                });
            }

            res.status(200).json({
                mensaje: 'Turnos disponibles consultados con éxito.',
                total: horarios.length,
                datos: horarios
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor: ' + err.message });
        }
    }
}

module.exports = VerHorariosYTurnosControlador;