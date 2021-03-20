// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');

// Importamos el paquete de encriptación
const bcrypt = require('bcryptjs');

// Importamos el modelo del Usuario 
const Usuario = require('../models/usuario');
// Importamos el helper para JWT
const { generarJWT } = require('../helpers/jwt');
// Importamos el helper para Google Verify
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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

        return res.status(200).json({
            success: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error durante la autenticación'
        });
    }
};

const googleSignin = async (req, res = response) => {
    const googleToken = req.body.token;

    try {
        const {name, email, picture} = await googleVerify(googleToken);
        let usuario;

        // Verificar si el email existe en la BD
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@', // Valor por defecto para los usuarios de Google (pero este pwd no se utilizará)
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = '@@@', // Si se modifica la pwd, el usuario perderá su autenticación "no google"
        }
        // Guardar el usuario en la BD
        await usuario.save();

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id);

        res.status(200).json({
            success: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            msg: 'Token incorrecto'
        });
    }
};

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar nuestro JWT
    const token = await generarJWT( uid);
    // Obtener usuario por uid
    const usuarioDB = await Usuario.findById(uid);

    res.status(200).json({
        success: true,
        token,
        usuario: usuarioDB,
        menu: getMenuFrontEnd(usuarioDB.role)
    });
};

module.exports = {
    login,
    googleSignin,
    renewToken
};