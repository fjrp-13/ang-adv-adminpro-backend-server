/*
    Ruta: /api/uploads
*/

// Importamos el Router de Express
const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { check } = require('express-validator');
// Importamos nuestro Middleware de validación
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos nuestro Middleware de validación de Token
const { validarJWT } = require('../middlewares/validar-jwt');

// Importamos el Controlador de Usuarios
const { uploadFile, getImage } = require('../controllers/uploads');

const router = Router();

// default options
// app.use(fileUpload());
router.use(fileUpload()); // Middleware "fileupload"

router.get( 
    '/:type/:image', 
    // [
    //     validarJWT, // El Middleware de validación de token será el 1º, para que, si falla, no haga nada más
    // ],
    getImage
);
router.put( 
    '/:type/:id', 
    [ 
        validarJWT, // El Middleware de validación de token será el 1º, para que, si falla, no haga nada más
        // Array con los Middleware de Validación (express-validator)
        // check('file', 'El nombre es obligatorio.').not().isEmpty(),
        // check('email', 'El email es incorrecto.').isEmail(),
        // Nuestros Middlewares, serán los últimos en llamarse
        validarCampos
    ] , 
    uploadFile
);

module.exports = router;