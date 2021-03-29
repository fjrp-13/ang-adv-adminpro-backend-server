const jwt = require("jsonwebtoken");
const { collection } = require("../models/usuario");
const Usuario = require('../models/usuario');

const validarJWT = (req, res = response, next) => {
    
    // Leer el token (se suele añadir el prefijo "x-" para los Headers personalizados)
    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            success: true,
            msg: 'Token necesario'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        // Añadimos a la Request el 'uid' que nos devuelve el token
        req.uid = uid;
        // Todo es correcto... Ejecutamos la "siguiente" función
        next();
    } catch (error) {
        // El jwt.verify ha dado un error
        return res.status(401).json({
            success: true,
            msg: 'Token incorrecto'
        });
    }

};

const validarADMIN_ROLE = async(req, res = response, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findByIdAndUpdate(uid);
        if (!usuarioDB) {
            return res.status(500).json({
                success: false,
                msg: 'Usuario incorrecto'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                msg: 'No tiene privilegios para realizar la solicitud'
            });
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Hable con el Administrador'
        });
    }    
};


/* Verifica si el usuario es el usuario que está logeado (o tiene el rol ADMIN_ROLE)
 */
const validarIsCurrentUser = async(req, res = response, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try {
        const usuarioDB = await Usuario.findByIdAndUpdate(uid);
        if (!usuarioDB) {
            return res.status(500).json({
                success: false,
                msg: 'Usuario incorrecto'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
            return res.status(403).json({
                success: false,
                msg: 'No tiene privilegios para realizar la solicitud'
            });
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Hable con el Administrador'
        });
    }    
};


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarIsCurrentUser
};