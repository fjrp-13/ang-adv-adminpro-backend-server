/*
    Ruta: /api/search
*/

// Importamos el Router de Express
const { Router } = require('express');
// Importamos nuestro Middleware de validación de Token
const { validarJWT } = require('../middlewares/validar-jwt');

// Importamos el Controlador de Búsquedas
const { doSearch, doSearchByType } = require('../controllers/busquedas');

const router = Router();

router.get( '/:query', validarJWT, doSearch);
router.get( '/type/:type/:query', validarJWT, doSearchByType);

module.exports = router;