const modelo = require('../../modelo/administrador/CrearHorariosModelo');

class CrearHorariosControlador {
    static async crear(req, res) {
        const { t1:nombre_turno, t2:dia_semana, t3:hora_inicio, t4:hora_fin, t5:estado, t6:capacidad_maxima } = req.body;

        // Validaciones obligatorias
        if (!nombre_turno || !dia_semana || !hora_inicio || !hora_fin || capacidad_maxima === undefined) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
        }

        if (isNaN(capacidad_maxima)) {
            return res.status(400).json({ error: 'La capacidad máxima debe ser un valor numérico.' });
        }

        // Regla de negocio RF06: La hora de fin debe ser estrictamente posterior a la hora de inicio
        if (hora_fin <= hora_inicio) {
            return res.status(400).json({ error: 'La hora de fin debe ser estrictamente posterior a la hora de inicio.' });
        }

        try {
            const resultado = await modelo.crearTurno({
                nombre_turno,
                dia_semana,
                hora_inicio,
                hora_fin,
                estado: estado !== undefined ? estado : 1, // Por defecto activo (1)
                capacidad_maxima
            });

            return res.status(201).json({ 
                mensaje: 'Turno registrado exitosamente.', 
                idTurnoCreado: resultado.insertId 
            });
        } catch (error) {
            console.error('Error al crear el horario:', error);
            return res.status(500).json({ error: 'Error interno al registrar el horario en la base de datos.' });
        }
    }
}

module.exports = CrearHorariosControlador;