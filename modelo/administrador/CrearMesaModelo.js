const conexion = require('..//bd/Conexion'); // Ajusta la ruta según la ubicación de tu archivo de conexión

class CrearMesaModelo {
    static async crearMesa(numero_mesa, capacidad, ubicacion, estado) {
        const query = `
            INSERT INTO mesas (numero_mesa, capacidad, ubicacion, estado) 
            VALUES (?, ?, ?, ?)
        `;

        // Ejecutamos la consulta usando la clase Conexion
        const resultado = await conexion.query(query, [
            numero_mesa, 
            capacidad, 
            ubicacion, 
            estado
        ]);

        return resultado;
    }
}

module.exports = CrearMesaModelo;