/*
    Ruta: /api/usuarios
*/

// Importamos el Router de Express
const { Router } = require('express');
const { check } = require('express-validator');
// Importamos nuestro Middleware de validación
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos nuestro Middleware de validación de Token
const { validarJWT } = require('../middlewares/validar-jwt');

// Importamos el Controlador de Usuarios
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');

const router = Router();

// No hace falta definir '/api/usuarios' como ruta del GET, ya que aquí sólo entrará si accede a '/api/usuarios'
// por lo tanto, definimos como ruta '/'
// pasamos como segundo argumento la función del controlador que realizará "la lógica de la ruta"
router.get( '/', validarJWT, getUsuarios);
router.post( 
    '/', 
    [ // Array con los Middleware de Validación (express-validator)
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('password', 'El password es obligatorio.').not().isEmpty(),
        check('email', 'El email es incorrecto.').isEmail(),
        // Nuestros Middlewares, serán los últimos en llamarse
        validarCampos
    ] , 
    crearUsuario
);
router.put( 
    '/:id', 
    [ 
        validarJWT, // El Middleware de validación de token será el 1º, para que, si falla, no haga nada más
        // Array con los Middleware de Validación (express-validator)
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es incorrecto.').isEmail(),
        // Nuestros Middlewares, serán los últimos en llamarse
        validarCampos
    ] , 
    actualizarUsuario
);
router.delete(
    '/:id', 
    validarJWT,
    borrarUsuario
);


module.exports = router;