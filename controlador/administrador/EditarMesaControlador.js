const modelo = require('../../modelo/administrador/EditarMesaModelo');

class EditarMesaControlador {
    static async editar(req, res) {
        const { idmesa } = req.params;
        // Mapeamos los 4 campos del formulario:
        // t1: número de mesa, t2: capacidad, t3: ubicación/zona, t4: estado
        const { t1: numMesa, t2: cap, t3: ubi, t4: est } = req.body;

        // ------------👁️‍🗨️ Validaciones 👁️‍🗨️----------------
        // Validar ID de la mesa
        if (!idmesa || isNaN(idmesa)) {
            return res.status(400).json({ error: 'El ID de la mesa es obligatorio y debe ser numérico.' });
        }

        // Validar campos vacíos
        const errorCampos = EditarMesaControlador.verCampos(numMesa, cap, ubi, est);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }

        // Validar número de mesa
        const errorNum = EditarMesaControlador.verNumeroMesa(numMesa);
        if (errorNum) {
            return res.status(400).json({ error: errorNum });
        }

        // Validar capacidad (Regla RF-09: entero mayor a cero)
        const errorCap = EditarMesaControlador.verCapacidad(cap);
        if (errorCap) {
            return res.status(400).json({ error: errorCap });
        }

        // Validar ubicación
        const errorUbi = EditarMesaControlador.verUbicacion(ubi);
        if (errorUbi) {
            return res.status(400).json({ error: errorUbi });
        }

        // Validar estado
        const errorEst = EditarMesaControlador.verEstado(est);
        if (errorEst) {
            return res.status(400).json({ error: errorEst });
        }

        try {
            // Verificar si la mesa existe en la BD
            const mesaExistente = await modelo.buscarPorId(idmesa);
            if (!mesaExistente) {
                return res.status(404).json({ error: 'La mesa seleccionada no existe en el sistema.' });
            }

            // Actualizar en la base de datos
            await modelo.actualizarMesa(idmesa, numMesa, cap, ubi, est);

            return res.status(200).json({
                mensaje: 'Mesa actualizada correctamente por el administrador.',
                mesa: {
                    idmesa: Number(idmesa),
                    numero_mesa: Number(numMesa),
                    capacidad: Number(cap),
                    ubicacion: ubi,
                    estado: est
                }
            });
        } catch (err) {
            // Alternativa A1 (RF-09): Manejar conflicto si cambia el número de mesa a uno ya existente
            if (err.message.includes("Duplicate entry")) {
                return res.status(409).json({
                    error: 'El número de mesa ingresado ya pertenece a otra mesa.',
                    sugerencia: 'Ingrese un identificador único.'
                });
            } else {
                return res.status(500).json({ error: 'Error del servidor: ' + err.message });
            }
        }
    }

    // ------------------- Validaciones auxiliares ----------------------------

    static verCampos(numMesa, cap, ubi, est) {
        if (!numMesa || !cap || !ubi || !est) {
            return 'Todos los campos (número de mesa, capacidad, ubicación, estado) son obligatorios.';
        }
        return null;
    }

    static verNumeroMesa(numMesa) {
        if (isNaN(numMesa) || Number(numMesa) <= 0) {
            return 'El número de mesa debe ser un valor numérico válido mayor a 0.';
        }
        return null;
    }

    static verCapacidad(cap) {
        if (isNaN(cap) || Number(cap) <= 0) {
            return 'La capacidad de comensales debe ser un número entero mayor a cero.';
        }
        return null;
    }

    static verUbicacion(ubi) {
        if (typeof ubi !== 'string' || ubi.trim().length < 2 || ubi.length > 50) {
            return 'La ubicación o zona debe tener entre 2 y 50 caracteres.';
        }
        return null;
    }

    static verEstado(est) {
        const estadosPermitidos = ['disponible', 'ocupada', 'mantenimiento'];
        if (!estadosPermitidos.includes(String(est).toLowerCase())) {
            return "El estado debe ser 'disponible', 'ocupada'.";
        }
        return null;
    }
}

module.exports = EditarMesaControlador;