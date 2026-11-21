const db = require('../modelo/bd/Conexion');

class LiberadorMesasServicio {
    
    // Ejecuta la actualización de reservas vencidas y liberación automática de mesas
    static async liberarMesasVencidas() {
        try {
            // 1. Marcar como 'completada' las reservas donde hayan pasado más de 2 horas desde su hora de inicio
            const queryReservas = `
                UPDATE reservas 
                SET estado = 'completada' 
                WHERE estado IN ('pendiente', 'confirmada') 
                  AND NOW() >= TIMESTAMPADD(HOUR, 2, TIMESTAMP(fecha_reserva, hora_reserva))
            `;
            const resReservas = await db.query(queryReservas);

            // 2. Liberar a 'disponible' todas las mesas que no tengan una reserva activa transcurriendo en este instante
            const queryMesas = `
                UPDATE mesas 
                SET estado = 'disponible' 
                WHERE idmesa NOT IN (
                    SELECT DISTINCT idmesa 
                    FROM reservas 
                    WHERE estado IN ('pendiente', 'confirmada')
                      AND NOW() BETWEEN TIMESTAMP(fecha_reserva, hora_reserva) 
                                    AND TIMESTAMPADD(HOUR, 2, TIMESTAMP(fecha_reserva, hora_reserva))
                ) AND estado = 'ocupada'
            `;
            const resMesas = await db.query(queryMesas);

            const reservasCompletadas = resReservas ? (resReservas.affectedRows || 0) : 0;
            const mesasLiberadas = resMesas ? (resMesas.affectedRows || 0) : 0;

            if (reservasCompletadas > 0 || mesasLiberadas > 0) {
                console.log(`⏱️ [Auto-Liberador]: ${reservasCompletadas} reserva(s) finalizada(s) y ${mesasLiberadas} mesa(s) liberada(s) a 'disponible'.`);
            }

            return {
                reservasCompletadas,
                mesasLiberadas
            };
        } catch (error) {
            console.error('❌ Error en LiberadorMesasServicio:', error.message);
            return { error: error.message };
        }
    }

    // Inicia el temporizador en segundo plano (revisión periódica)
    static iniciarMonitoreo(intervaloMs = 2 * 60 * 1000) {
        // Ejecución inmediata al arrancar el servidor
        LiberadorMesasServicio.liberarMesasVencidas();

        // Ejecución recurrente en segundo plano
        setInterval(() => {
            LiberadorMesasServicio.liberarMesasVencidas();
        }, intervaloMs);

        console.log('🔄 Servicio automático de liberación de mesas iniciado (revisión cada 2 minutos).');
    }
}

module.exports = LiberadorMesasServicio;
