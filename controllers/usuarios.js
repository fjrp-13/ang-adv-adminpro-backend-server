// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');
// Importamos el resultado de la validación --> Ya no hace falta, pq se controlará desde nuestro Middleware 'validar-campos'
// const { validationResult } = require('express-validator');

// Importamos el paquete de encriptación
const bcrypt = require('bcryptjs');

// Importamos el modelo del Usuario 
const Usuario = require('../models/usuario');
// Importamos el helper para JWT
const { generarJWT } = require('../helpers/jwt');

const getUsuarios_sin_paginacion = async (req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email img role google');
    res
    .status(200)
    .json({
        success: true,
        usuarios,
        uid: req.uid // devolvemos el uid del usuario que hizo la petición (y que hemos añadido a la Request desde el Middleware "validar-jwt")
    });
};

const getUsuarios = async (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 5;

    // const usuarios = await Usuario
    //                         .find({}, 'nombre email img role google')
    //                         .skip(from)
    //                         .limit(limit);
    // const total = await Usuario.count();
    const promesa1 = Usuario
                        .find({}, 'nombre email img role google')
                        .skip(from)
                        .limit(limit);
    const promesa2 = Usuario.countDocuments();
    const [ usuarios, total ] = await Promise.all([promesa1, promesa2]); // Para que las promesas se ejecuten de manera simultánea pero que espere a que TODAS las promesas hayan finalizado
    
    res
    .status(200)
    .json({
        success: true,
        usuarios,
        total,
        uid: req.uid // devolvemos el uid del usuario que hizo la petición (y que hemos añadido a la Request desde el Middleware "validar-jwt")
    });
};

const crearUsuario = async (req, res = response) => {
    const { email, password, nombre } = req.body;
    try {
        // Validaciones
        const usuarioEmail = await Usuario.findOne({email})
        if (usuarioEmail) {
            return res.status(400).json({
                success: false,
                msg: 'Email duplicado'
            });
        }

        // Instanciamos la clase del Usuario
        const usuarioDB = new Usuario( req.body );
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(); // Opción "...Sync" para que sea síncrona (así, no hay que usar async/await)
        usuarioDB.password = bcrypt.hashSync(password, salt);

        // Guardar el usuario en la BD
        await usuarioDB.save(); // es una promesa, por lo que marcamos la llamada con un "await" (para que "espera a su resolución") 
                            // y la función con un "async"
        // Si no hubieramos marcado la Promesa anterior con "await", esto se podría ejecutar ANTES que se resolviera la Promesa

        // Generar el token JWT (usamos .id y Mongoose ya sabrá intrepretar que buscamos el ID del usuario)
        const token = await generarJWT(usuarioDB.id);
        res
        .status(200)
        .json({
            success: true,
            usuario: usuarioDB,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error inesperado'
        });
    }
};

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    const { email, password, nombre } = req.body;

    try {
        // Validaciones
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        // TODO: Validar Token y comprobar si es el usuario correcto

        // Guardamos un objeto con los campos (menos 'password', 'google' ni 'email')
        const {password, google, email, ...campos} = req.body;
        // // Y le borramos los campos que NO queremos que se actualicen
        // delete campos.password;
        // delete campos.google;
        // Si no le quiere actualizar el email, NO actualizamos el email para que no dé el problema con los duplicados
        if (usuarioDB.email !== email) {
            const usuarioDBEmail = await Usuario.findOne({email});
            if (usuarioDBEmail) {
                return res.status(400).json({
                    success: false,
                    msg: 'Email duplicado'
                });
            }
            // Añadimos el nuevo email
            campos.email = email;
        }

        //const filter = { _id: uid };
        // let usuarioUpdated = await Usuario.findOneAndUpdate(filter, campos, {
        //     new: true
        //   });
        const usuarioUpdated = await Usuario.findByIdAndUpdate( uid, campos, {new:true} );

        res
        .status(200)
        .json({
            success: true,
            usuario: usuarioUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado 2'
        });
    }
};

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        const usuarioUpdated = await Usuario.findByIdAndDelete( uid );

        res
        .status(200)
        .json({
            success: true,
            msg: 'Usuario borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado 2'
        });
    }
};




module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
};