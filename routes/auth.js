/*
    Ruta: /api/login
*/

// Importamos el Router de Express
const { Router } = require('express');
const { check } = require('express-validator');
// Importamos nuestro Middleware de validación
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos nuestro Middleware de validación de Token
const { validarJWT } = require('../middlewares/validar-jwt');


// Importamos el Controlador de Auth
const { login, googleSignin, renewToken } = require('../controllers/auth');

const router = Router();

// No hace falta definir '/api/login' como ruta del GET, ya que aquí sólo entrará si accede a '/api/login'
// por lo tanto, definimos como ruta '/'
// pasamos como segundo argumento la función del controlador que realizará "la lógica de la ruta"
router.post( 
    '/', 
    [ // Array con los Middleware de Validación (express-validator)
        check('email', 'El email es incorrecto.').isEmail(),
        check('password', 'El password es obligatorio.').not().isEmpty(),
        // Nuestro Middleware, será el último en llamarse
        validarCampos
    ] , 
    login
);

router.post( 
    '/google', 
    [
        check('token', 'El token es obligatorio.').not().isEmpty(),
        // Nuestro Middleware, será el último en llamarse
        validarCampos
    ] , 
    googleSignin
);


router.get( 
    '/renew', 
    [
        validarJWT,
    ] , 
    renewToken
);
module.exports = router;