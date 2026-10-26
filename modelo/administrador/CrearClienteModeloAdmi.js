const dbService = require('../bd/Conexion');
const bcrypt = require('bcrypt');

class CrearClienteModeloAdmi {
    // funcion para crear nuevos clientes por el admin
    static async crearClientes(nom, corr, tel, contra) {
        try {
            // Generar el hash de la contraseña con bcrypt
            const salto = 10; // Nivel de seguridad de encriptación
            const contraHash = await bcrypt.hash(contra, salto);

            // Consulta SQL adaptada exactamente a las 4 columnas de tu tabla
            const query = 'INSERT INTO clientes (nombre, correo, telefono, contraseña) VALUES (?, ?, ?, ?)';

            // Ejecutamos la consulta enviando los valores en orden
            return await dbService.query(query, [nom, corr, tel, contraHash]);
        } catch (err) {
            throw new Error(`Error al crear su nueva cuenta cliente: ${err.message}`);
        }
    } //cerrar crear cliente
}

module.exports = CrearClienteModeloAdmi;