//este conecta con los datos .env
//no es necesario pasarcelo a este archivo para protegerlos 
//datos sencibles
require('dotenv').config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

// Validar que todas las variables requeridas estén definidas
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  La variable de entorno ${key} no está definida.`);
  }
});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

module.exports = dbConfig;