// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');
// Importamos el resultado de la validación --> Ya no hace falta, pq se controlará desde nuestro Middleware 'validar-campos'
// const { validationResult } = require('express-validator');

// Importamos el modelo del Hospital 
const Hospital = require('../models/hospital');
// Importamos el helper para JWT
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async (req, res) => {
    //const hospitales = await Hospital.find({}, 'nombre img');
    const hospitales = await Hospital.find({})
        .populate('usuario', 'nombre img'); // Populate: para obtener los datos del objeto "usuario"
    res
    .status(200)
    .json({
        success: true,
        hospitales,
    });
};

const crearHospital = async (req, res = response) => {
    const { nombre } = req.body;
    const uid = req.uid;
    try {

        // Validaciones
        const hospitalNombre = await Hospital.findOne({nombre});
        if (hospitalNombre) {
            return res.status(400).json({
                success: false,
                msg: 'Nombre duplicado'
            });
        }
        
        // Instanciamos la clase del Hospital
        const hospitalDB = new Hospital( {
            usuario: uid,
            ...req.body
        } );
        
        // Guardar el hospital en la BD
        await hospitalDB.save(); // es una promesa, por lo que marcamos la llamada con un "await" (para que "espera a su resolución") 
                                 // y la función con un "async"
        // Si no hubieramos marcado la Promesa anterior con "await", esto se podría ejecutar ANTES que se resolviera la Promesa
        // Generar el token JWT (usamos .usuario y Mongoose ya sabrá intrepretar que buscamos el ID del usuario)
        const token = await generarJWT(hospitalDB.usuario);
        res
        .status(200)
        .json({
            success: true,
            hospital: hospitalDB,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado X'
        });
    }
};

const actualizarHospital = async (req, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;

    try {
        // Validaciones
        const hospitalDB = await Hospital.findById(id);
        if (!hospitalDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        // Validar Token y comprobar si es el usuario correcto
        // if (hospitalDB.usuario !== uid) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: 'No eres el usuario que creó el hospital'
        //     });
        // }

        // Guardamos un objeto con los campos
        const { nombre, ...campos} = req.body;
        // Si no le quiere actualizar el nombre, NO actualizamos el nombre para que no dé el problema con los duplicados
        if (hospitalDB.nombre !== nombre) {
            const hospitalBDNombre = await Hospital.findOne({nombre});
            if (hospitalBDNombre) {
                return res.status(400).json({
                    success: false,
                    msg: 'Nombre duplicado'
                });
            }
            // Añadimos el nuevo nombre
            campos.nombre = nombre;
            //campos.usuario = uid; // actualizamos el usuario que no ha modificado (si fuera necesario)
        }

        const hospitalUpdated = await Hospital.findByIdAndUpdate( id, campos, {new:true} );

        res
        .status(200)
        .json({
            success: true,
            hospital: hospitalUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado 2'
        });
    }
};

const borrarHospital = async (req, res = response) => {
    const id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById(id);
        if (!hospitalDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        const hospitalDeleted = await Hospital.findByIdAndDelete( id );

        res
        .status(200)
        .json({
            success: true,
            msg: 'Hospital borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Error inesperado 3'
        });
    }
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
};