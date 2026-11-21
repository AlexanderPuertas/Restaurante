const dbService = require('../bd/Conexion');
const bcrypt = require('bcrypt');

class CrearAdminModeloAdmi {
    
    // Verificar si ya existe un administrador con el mismo correo o documento (RF-16 CA-02 / A1)
    static async buscarPorCorreoODocumento(correo, documento) {
        const query = 'SELECT idAdmin, correo, documento FROM administradores WHERE correo = ? OR documento = ?';
        try {
            const filas = await dbService.query(query, [correo, documento]);
            return filas || [];
        } catch (err) {
            throw new Error(`Error al verificar administrador existente: ${err.message}`);
        }
    }

    // Registrar nuevo administrador en la base de datos (RF-16 CA-01)
    static async crearAdmin(nombre, documento, correo, telefono, clave, estado = 1) {
        try {
            // Cifrar la contraseña temporal con bcrypt (salto = 10)
            const salto = 10;
            const contraHash = await bcrypt.hash(clave, salto);

            const query = `
                INSERT INTO administradores (nombre, documento, correo, telefono, contraseña, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const resultado = await dbService.query(query, [
                nombre, 
                documento, 
                correo, 
                telefono, 
                contraHash, 
                estado
            ]);

            return resultado;
        } catch (err) {
            throw new Error(`Error al registrar el administrador en la BD: ${err.message}`);
        }
    }

    // Consultar administrador por ID recién creado
    static async obtenerPorId(idAdmin) {
        const query = 'SELECT idAdmin, nombre, documento, correo, telefono, estado, fecha_creacion FROM administradores WHERE idAdmin = ?';
        try {
            const filas = await dbService.query(query, [idAdmin]);
            return filas[0] || null;
        } catch (err) {
            throw new Error(`Error al consultar administrador: ${err.message}`);
        }
    }
}

module.exports = CrearAdminModeloAdmi;
