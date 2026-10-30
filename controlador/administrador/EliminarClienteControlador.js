const modelo = require('../../modelo/administrador/EliminarClienteModelo');

class EliminarClienteControlador {
    static async eliminar(req, res) {
        const { correo } = req.params;

        if (!correo) {
            return res.status(400).json({ error: 'El correo del cliente es obligatorio.' });
        }

        try {
            // Validar existencia previa 
            const cliente = await modelo.buscarPorCorreo(correo);
            if (!cliente) {
                return res.status(404).json({ error: 'El cliente no existe o ya fue eliminado del sistema.' });
            }

            await modelo.eliminarCliente(correo);

            res.status(200).json({
                mensaje: 'Cliente eliminado correctamente por el administrador.',
                correoEliminado: correo
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error del servidor al eliminar el cliente: ' + err.message });
        }
    }
}

module.exports = EliminarClienteControlador;