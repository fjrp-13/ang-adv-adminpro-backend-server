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
// Middleware para la lectura y parseo del Body
app.use(express.json());

// Base de Datos
dbConnection();

// Directorio Público
app.use(express.static('public'));

// Rutas
// ... definimos nuestros Middleware de Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/search', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
// app.get( '/api/usuarios', (req, res) => {
//     res
//     .status(200)
//     .json({
//         success: true,
//         usuarios: [{
//             id: 123,
//             nombre: 'Usuario 123'
//         }]
//     });
// });

// Levantar el servidor en el puerto que queramos (en este caso, el 3000)
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en el puerto ${ process.env.PORT }`);
});