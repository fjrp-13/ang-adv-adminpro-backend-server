// Import para tener el "tipado" de la response
const { response } = require('express');
// Importamos el resultado de la validación
const { validationResult } = require('express-validator');

// Los Middlewares, reciben el método "next"
const validarCampos = (req, res = response, next) => {
    
    // Obtenemos un array con los posibles errores
    const errores = validationResult( req );

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            errores: errores.mapped()
        });
    }

    // Todo es correcto... Ejecutamos la "siguiente" función
    next();
};

module.exports = {
    validarCampos
};