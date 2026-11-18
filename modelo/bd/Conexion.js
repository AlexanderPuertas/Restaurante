const mysql = require('mysql2');
const dbConfig = require('./config');

class Conexion {
  constructor() {
    this.pool = mysql.createPool(dbConfig); // Crea un pool de conexiones

    // Verifica la conexión en el inicio
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
      } else {
        console.log('✅ Conectado a la base de datos');
        connection.release();  // Libera la conexión al pool
      }
    });
  }

  // Utiliza promise() para convertir la consulta en una promesa
  query(queryString, params) {
    return this.pool.promise().query(queryString, params)
      .then(([results]) => results)  // Obtiene solo los resultados (sin metadatos)
      .catch(err => {
        console.error('❌ Error durante la consulta:', err.message);
        throw err;  // Vuelve a lanzar el error para ser manejado fuera
      });
  }

  async transaction(callback) {
    const connection = await this.pool.promise().getConnection();
    let transactionStarted = false;

    try {
      await connection.beginTransaction();
      transactionStarted = true;

      const result = await callback(connection);

      await connection.commit();
      transactionStarted = false;
      return result;
    } catch (err) {
      if (transactionStarted) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          throw new Error(
            `Error en la transacción: ${err.message}. También falló el rollback: ${rollbackError.message}`
          );
        }
      }
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new Conexion();  // Exporta una instancia única de la clase