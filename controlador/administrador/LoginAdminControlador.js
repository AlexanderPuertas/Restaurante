const modelo = require('../../modelo/administrador/LoginAdminModelo');

class LoginAdminControlador {
    // RF-17: Inicio de sesión del administrador (LOGIN)
    static async login(req, res) {
        const body = req.body || {};
        const corr = body.correo || body.email || body.t1;
        const contra = body.contraseña || body.clave || body.password || body.t2;

        // ------------ 👁️‍🗨️ Validaciones RF-17 CA-03 / A2 👁️‍🗨️ ------------
        // 1. Campos obligatorios
        const errorCampos = LoginAdminControlador.verCampos(corr, contra);
        if (errorCampos) {
            return res.status(400).json({ error: errorCampos });
        }

        // 2. Formato de correo electrónico
        const errorEmail = LoginAdminControlador.verEmail(corr);
        if (errorEmail) {
            return res.status(400).json({ error: errorEmail });
        }

        try {
            // Buscar al administrador en la base de datos
            const admin = await modelo.buscarPorCorreo(corr);
            if (!admin) {
                // CA-02 / A1: Correo no existe en el sistema
                return res.status(401).json({ 
                    error: 'Credenciales inválidas. Correo o contraseña incorrectos (CA-02).' 
                });
            }

            // A3: Verificar si la cuenta administrativa se encuentra activa
            if (admin.estado !== 1 && admin.estado !== true) {
                return res.status(403).json({ 
                    error: 'Cuenta de administrador inactiva o deshabilitada. Comuníquese con la administración superior.' 
                });
            }

            // Comparar contraseña con el hash usando bcrypt (CA-02 / A1)
            const esValida = await modelo.verificarContrasena(contra, admin.contrasena);
            if (!esValida) {
                return res.status(401).json({ 
                    error: 'Credenciales inválidas. Correo o contraseña incorrectos (CA-02).' 
                });
            }

            // CA-01: Inicio de sesión exitoso
            return res.status(200).json({
                success: true,
                mensaje: 'Inicio de sesión administrativo exitoso (CA-01).',
                administrador: {
                    idAdmin: admin.idAdmin,
                    nombre: admin.nombre,
                    documento: admin.documento,
                    correo: admin.correo,
                    telefono: admin.telefono,
                    rol: 'Administrador',
                    estado: 'Activo'
                }
            });

        } catch (err) {
            console.error('Error en login de administrador (RF-17):', err);
            return res.status(500).json({ 
                error: 'Error inesperado del servidor: ' + err.message 
            });
        }
    }

    // Métodos auxiliares de validación
    static verCampos(corr, contra) {
        if (!corr || !contra) {
            return 'Todos los campos son obligatorios: correo y contraseña (CA-03).';
        }
        return null;
    }

    static verEmail(email) {
        const er = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!er.test(email) || email.length > 250) {
            return 'Formato de correo electrónico inválido. Ejemplo: admin@elbuensabor.com';
        }
        return null;
    }
}

module.exports = LoginAdminControlador;
