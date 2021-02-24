// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');

// Importamos el paquete de encriptación
const bcrypt = require('bcryptjs');

// Importamos el modelo del Usuario 
const Usuario = require('../models/usuario');
// Importamos el helper para JWT
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const {email, password} = req.body;

    try {
        // Verificar Email
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(400).json({
                success: false,
                msg: 'EMAIL o Contraseña incorrectos'
            });
        }

        // Verificar Password
        const validPwd = bcrypt.compareSync(password, usuarioDB.password)
        if (!validPwd) {
            return res.status(400).json({
                success: false,
                msg: 'Email o CONTRASEÑA incorrectos'
            });
        }

        // Generar el token JWT (usamos .id y Mongoose ya sabrá intrepretar que buscamos el ID del usuario)
        const token = await generarJWT(usuarioDB.id);

        return res.status(400).json({
            success: false,
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error durante la autenticación'
        });
    }
};


module.exports = {
    login,
};