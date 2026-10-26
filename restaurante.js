const express = require('express');
const cors = require('cors');

// Importa la ruta real que tienes creada en tu explorador:
const RutasAdmi = require('./vista/administrador/RutasAdmi');
const RutasCli = require('./vista/cliente/RutasCli');

const app = express();
const PORT = process.env.PORT || 5020;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parseo de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar la ruta agrupada
app.use('/', RutasAdmi);
app.use('/', RutasCli);

app.get('/', (req, res) => {
    res.send('Bienvenido a la API del restaurante');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});