// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');
// Importamos el resultado de la validación
const { validationResult } = require('express-validator');
// Importamos el modelo del Usuario
const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');
    res
    .status(200)
    .json({
        success: true,
        usuarios,
    });
};

const crearUsuarios = async (req, res = response) => {
    const { email, password, nombre } = req.body;

    // Obtenemos un array con los posibles errores
    const errores = validationResult( req );

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            errores: errores.mapped()
        });
    }

    try {
        // Validaciones
        const existeEmail = await Usuario.findOne({email})
        if (existeEmail) {
            return res.status(400).json({
                success: false,
                msg: 'Email duplicado'
            });
        }

        // Instanciamos la clase del Usuario
        const usuario = new Usuario( req.body );
        // Grabamos en la BD
        await usuario.save(); // es una promesa, por lo que marcamos la llamada con un "await" (para que "espera a su resolución") 
                            // y la función con un "async"
        // Si no hubieramos marcado la Promesa anterior con "await", esto se podría ejecutar ANTES que se resolviera la Promesa
        res
        .status(200)
        .json({
            success: true,
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado'
        });
    }
};

module.exports = {
    getUsuarios,
    crearUsuarios,
};