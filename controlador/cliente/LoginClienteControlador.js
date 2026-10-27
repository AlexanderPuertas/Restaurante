const modelo = require('../../modelo/cliente/LoginClienteModelo');

class LoginClienteControlador {
    static async login(req, res) {
        const { t1: corr, t2: contra } = req.body;

        // ------------ Validaciones ------------
        // 1. Campos obligatorios
        const errorCampos = LoginClienteControlador.verCampos(corr, contra);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }

        // 2. Formato de correo
        const errorEmail = LoginClienteControlador.verEmail(corr);
        if (errorEmail) {
            return res.status(400).json({ error: errorEmail });
        }

        try {
            // Buscar si existe el cliente
            const cliente = await modelo.buscarPorCorreo(corr);
            if (!cliente) {
                return res.status(401).json({ error: 'Credenciales inválidas. Correo o contraseña incorrectos.' });
            }

            // Comparar contraseña con bcrypt
            const esValida = await modelo.verificarContrasena(contra, cliente.contrasena);
            if (!esValida) {
                return res.status(401).json({ error: 'Credenciales inválidas. Correo o contraseña incorrectos.' });
            }

           // Inicio de sesión exitoso
            res.status(200).json({
                mensaje: 'Inicio de sesión exitoso.',
                usuario: {
                    nombres: cliente.nombres,
                    correo: cliente.correo
                }
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error inesperado del servidor: ' + err.message });
        }
    }

    // Métodos de validación
    static verCampos(corr, contra) {
        if (!corr || !contra) {
            return 'Todos los campos son obligatorios.';
        }
        return null;
    }

    static verEmail(email) {
        const er = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!er.test(email) || email.length > 250) {
            return 'Correo inválido. Ejemplo válido: ejemplo@email.com';
        }
        return null;
    }
}

module.exports = LoginClienteControlador;