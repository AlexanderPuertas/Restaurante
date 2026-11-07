const modelo = require('../../modelo/administrador/EliminarMesaModelo'); 

class EliminarMesaControlador {
    static async eliminar(req, res) {
        const { idmesa } = req.params;

        // Validar que el ID sea obligatorio y numérico
        if (!idmesa || isNaN(idmesa)) {
            return res.status(400).json({ error: 'El ID de la mesa es obligatorio y debe ser numérico.' });
        }

        try {
            // Validar existencia previa de la mesa
            const mesa = await modelo.buscarPorId(idmesa);
            if (!mesa) {
                return res.status(404).json({ error: 'La mesa no existe o ya fue eliminada del sistema.' });
            }

            // Regla de negocio 
            const tieneReservas = await modelo.verificarReservasActivas(idmesa);
            if (tieneReservas) {
                return res.status(400).json({ 
                    error: 'No se puede eliminar la mesa porque posee reservas vigentes o activas asignadas. Debe reasignarlas o cancelarlas previamente.' 
                });
            }

            // Proceder a eliminar la mesa del inventario físico
            await modelo.eliminarMesa(idmesa);

            res.status(200).json({
                mensaje: 'Mesa eliminada correctamente del inventario por el administrador.',
                idMesaEliminada: Number(idmesa)
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor al eliminar la mesa: ' + err.message });
        }
    }
}

module.exports = EliminarMesaControlador;