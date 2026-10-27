const dbService = require('../bd/Conexion');
const bcrypt = require('bcrypt');

class LoginClienteModelo {
    // Buscar al cliente por su correo electrónico trayendo todos los campos
    static async buscarPorCorreo(correo) {
        const query = 'SELECT nombre AS nombres, correo, `contraseña` AS contrasena FROM clientes WHERE correo = ?';
        try {
            const filas = await dbService.query(query, [correo]);
            return filas[0] || null; // Retorna el cliente o null si no existe
        } catch (err) {
            throw new Error(`Error al buscar cliente: ${err.message}`);
        }
    }

    // Validar contraseña plana contra la encriptada
    static async verificarContrasena(contrasenaIngresada, contrasenaHash) {
        return await bcrypt.compare(contrasenaIngresada, contrasenaHash);
    }
}

module.exports = LoginClienteModelo;