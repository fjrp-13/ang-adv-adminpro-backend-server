// Mediante el paquete 'dotenv', busca el fichero con extensión '.env' y lo establece en las variables de entorno de NodeJS
// Se podrán leer esas variables de entorno a traves del objeto "process.env"
require('dotenv').config();

// Importar Express
const express = require('express');

// Importar CORS
const cors = require('cors');

// Importar mi obj de configuración de la conexión a la DB
const { dbConnection } = require('./database/config');

// crear el servicor Express
const app = express();
// Configurar CORS
app.use(cors()); // use = Middleware

// Base de Datos
dbConnection();

// Rutas
app.get( '/', (req, res) => {
    res
    .status(200)
    .json({
        success: true,
        msg: 'Hola Mundo'
    });
});

// Levantar el servidor en el puerto que queramos (en este caso, el 3000)
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${ process.env.PORT }`);
});