const dbService = require('../bd/Conexion');
const bcrypt = require('bcrypt');

class LoginAdminModelo {
    // Buscar al administrador por correo electrónico (RF-17)
    static async buscarPorCorreo(correo) {
        const query = `
            SELECT 
                idAdmin, 
                nombre, 
                documento, 
                correo, 
                telefono, 
                \`contraseña\` AS contrasena, 
                estado, 
                fecha_creacion 
            FROM administradores 
            WHERE correo = ?
        `;
        try {
            const filas = await dbService.query(query, [correo]);
            return filas[0] || null; // Retorna el administrador o null si no existe
        } catch (err) {
            throw new Error(`Error al consultar administrador por correo: ${err.message}`);
        }
    }

    // Validar contraseña ingresada contra el hash almacenado en la BD (bcrypt)
    static async verificarContrasena(contrasenaIngresada, contrasenaHash) {
        return await bcrypt.compare(contrasenaIngresada, contrasenaHash);
    }
}

module.exports = LoginAdminModelo;
