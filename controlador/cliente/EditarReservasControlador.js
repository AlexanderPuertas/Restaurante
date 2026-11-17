const EditarReservasModelo = require('../../modelo/cliente/EditarReservasModelo'); 

class EditarReservasControlador {

    // Validar política de tiempo (mínimo 2 horas de anticipación)
    static validarPoliticaTiempo(fechaReserva, horaReserva) {
        try {
            let fechaStr = fechaReserva;
            if (fechaReserva instanceof Date) {
                fechaStr = fechaReserva.toISOString().split('T')[0];
            } else if (typeof fechaReserva === 'string' && fechaReserva.includes('T')) {
                fechaStr = fechaReserva.split('T')[0];
            }

            // Normalizar hora (reemplazar puntos por dos puntos si vinieran como 19.00.00)
            const horaNormalizada = String(horaReserva || '').replace(/\./g, ':');
            const fechaHoraReserva = new Date(`${fechaStr}T${horaNormalizada}`);
            const ahora = new Date();
            
            const diferenciaMilisegundos = fechaHoraReserva.getTime() - ahora.getTime();
            const horasRestantes = diferenciaMilisegundos / (1000 * 60 * 60);

            // Si es fecha inválida o ya pasó la fecha o falta menos de 2 horas
            if (isNaN(horasRestantes) || diferenciaMilisegundos < 0 || horasRestantes < 2) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // Cancelar Reserva
    static async cancelarReserva(req, res) {
        try {
            const { idReserva } = req.params;

            const reserva = await EditarReservasModelo.obtenerReservaPorId(idReserva);
            if (!reserva) {
                return res.status(404).json({ error: "La reserva no existe." });
            }

            // Validar estado activo/pendiente/confirmada
            const estadoActual = (reserva.estado || '').toLowerCase();
            if (estadoActual !== 'pendiente' && estadoActual !== 'confirmada') {
                return res.status(400).json({ error: "La reserva no se encuentra en un estado válido para ser cancelada." });
            }

            // Validar regla de tiempo (2 horas)
            if (!EditarReservasControlador.validarPoliticaTiempo(reserva.fecha_reserva, reserva.hora_reserva)) {
                return res.status(400).json({ error: "No se puede cancelar la reserva con menos de 2 horas de anticipación. Comuníquese con la administración." });
            }

            // Cambiar estado a Cancelada
            const cancelado = await EditarReservasModelo.cambiarEstado(idReserva, 'Cancelada');
            if (cancelado) {
                // Liberar la mesa
                await EditarReservasModelo.liberarMesa(reserva.idmesa);
                return res.json({ mensaje: "Reserva cancelada exitosamente y mesa liberada." });
            }

            return res.status(500).json({ error: "No se pudo procesar la cancelación." });

        } catch (error) {
            console.error("Error en cancelarReserva:", error);
            return res.status(500).json({ error: "Error interno del servidor.", detalle: error.message });
        }
    }

    // Editar / Reprogramar Reserva
    static async editarReserva(req, res) {
        try {
            const { idReserva } = req.params;
            const body = req.body || {};

            // Compatibilidad de nombres de campos
            const nuevaFecha = body.nuevaFecha || body.fecha || body.fecha_reserva;
            const nuevaHora = body.nuevaHora || body.hora || body.hora_reserva;
            const idNuevaMesa = body.idNuevaMesa || body.idMesa || body.idmesa;
            const numeroPersonas = body.numeroPersonas || body.numPersonas || body.numero_personas;

            // Validación de campos obligatorios
            if (!nuevaFecha || !nuevaHora || !idNuevaMesa || !numeroPersonas) {
                return res.status(400).json({ 
                    error: "Faltan campos obligatorios en el cuerpo de la petición.",
                    camposRequeridos: ["nuevaFecha", "nuevaHora", "idNuevaMesa", "numeroPersonas"],
                    recibido: body
                });
            }

            const reserva = await EditarReservasModelo.obtenerReservaPorId(idReserva);
            if (!reserva) {
                return res.status(404).json({ error: "La reserva no existe." });
            }

            // Validar estado
            const estadoActual = (reserva.estado || '').toLowerCase();
            if (estadoActual !== 'pendiente' && estadoActual !== 'confirmada') {
                return res.status(400).json({ error: "La reserva no es modificable en su estado actual." });
            }

            // Validar política de tiempo (mínimo 2 horas)
            if (!EditarReservasControlador.validarPoliticaTiempo(reserva.fecha_reserva, reserva.hora_reserva)) {
                return res.status(400).json({ error: "No se puede modificar la reserva fuera del tiempo límite permitido (mínimo 2 horas)." });
            }

            // Verificar si la nueva mesa está disponible (excluyendo la reserva que estamos editando)
            const mesaDisponible = await EditarReservasModelo.verificarDisponibilidadMesa(idNuevaMesa, nuevaFecha, nuevaHora, idReserva);
            if (!mesaDisponible) {
                return res.status(400).json({ error: "La nueva fecha, hora o mesa seleccionada ya no se encuentra libre. Elija otro bloque." });
            }

            const idMesaAntigua = reserva.idmesa;

            // Actualizar la reserva en la BD
            const actualizado = await EditarReservasModelo.actualizarDatos(idReserva, nuevaFecha, nuevaHora, idNuevaMesa, numeroPersonas);
            
            if (actualizado) {
                // Solo si cambió de mesa: liberar la anterior y ocupar la nueva
                if (String(idMesaAntigua) !== String(idNuevaMesa)) {
                    await EditarReservasModelo.liberarMesa(idMesaAntigua);
                    await EditarReservasModelo.ocuparMesa(idNuevaMesa);
                }

                return res.json({ 
                    mensaje: "Reserva actualizada exitosamente.",
                    datosActualizados: {
                        idReserva,
                        nuevaFecha,
                        nuevaHora,
                        idNuevaMesa,
                        numeroPersonas
                    }
                });
            }

            return res.status(500).json({ error: "No se pudo actualizar la reserva." });

        } catch (error) {
            console.error("Error en editarReserva:", error);
            return res.status(500).json({ error: "Error interno del servidor.", detalle: error.message });
        }
    }
}

module.exports = EditarReservasControlador;