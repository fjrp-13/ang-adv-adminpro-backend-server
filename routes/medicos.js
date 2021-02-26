/*
    Ruta: /api/medicos
*/

// Importamos el Router de Express
const { Router } = require('express');
const { check } = require('express-validator');

// Importamos nuestro Middleware de validación
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos nuestro Middleware de validación de Token
const { validarJWT } = require('../middlewares/validar-jwt');

// Importamos el Controlador de Médicos
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

// No hace falta definir '/api/medicos' como ruta del GET, ya que aquí sólo entrará si accede a '/api/medicos'
// por lo tanto, definimos como ruta '/'
// pasamos como segundo argumento la función del controlador que realizará "la lógica de la ruta"
router.get( '/', validarJWT, getMedicos);
router.post( 
    '/', 
    [   validarJWT,
        // Array con los Middleware de Validación (express-validator)
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('hospital', 'El id del Hospital es incorrecto.').isMongoId(), // Validar IDs de Mongo
        // Nuestros Middlewares, serán los últimos en llamarse
        validarCampos
    ] , 
    crearMedico
);
router.put( 
    '/:id', 
    [ 
        validarJWT, // El Middleware de validación de token será el 1º, para que, si falla, no haga nada más
        // Array con los Middleware de Validación (express-validator)
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('hospital', 'El id del Hospital es incorrecto.').isMongoId(), // Validar IDs de Mongo
        // Nuestros Middlewares, serán los últimos en llamarse
        validarCampos
    ] , 
    actualizarMedico
);
router.delete(
    '/:id', 
    validarJWT,
    borrarMedico
);


module.exports = router;