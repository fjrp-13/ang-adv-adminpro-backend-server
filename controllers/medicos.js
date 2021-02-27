// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');
// Importamos el resultado de la validación --> Ya no hace falta, pq se controlará desde nuestro Middleware 'validar-campos'
// const { validationResult } = require('express-validator');

// Importamos el modelo del Médico 
const Medico = require('../models/medico');
// Importamos el helper para JWT
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async (req, res) => {
    const medicos = await Medico.find({}, 'nombre img')
            .populate('usuario', 'nombre img' )
            .populate('hospital', 'nombre' );
    res
    .status(200)
    .json({
        success: true,
        medicos,
    });
};

const crearMedico = async (req, res = response) => {
    const uid = req.uid;
    try {
        // Instanciamos la clase del Médico
        const medicoDB = new Medico( {
            usuario: uid,
            ...req.body
        } );

        // Guardar el médico en la BD
        await medicoDB.save(); // es una promesa, por lo que marcamos la llamada con un "await" (para que "espera a su resolución") 
                               // y la función con un "async"
        // Si no hubieramos marcado la Promesa anterior con "await", esto se podría ejecutar ANTES que se resolviera la Promesa

        const token = await generarJWT(medicoDB.usuari);
        res
        .status(200)
        .json({
            success: true,
            medico: medicoDB,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error inesperado'
        });
    }
};

const actualizarMedico = async (req, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;

    try {
        // Validaciones
        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        // Guardamos un objeto con los campos
        const { nombre, ...campos} = req.body;
        // Si no le quiere actualizar el nombre, NO actualizamos el nombre para que no dé el problema con los duplicados
        if (medicoDB.nombre !== nombre) {
            const medicoBDNombre = await Medico.findOne({nombre});
            if (medicoBDNombre) {
                return res.status(400).json({
                    success: false,
                    msg: 'Nombre duplicado'
                });
            }
            // Añadimos el nuevo nombre
            campos.nombre = nombre;
        }

        const medicoUpdated = await Medico.findByIdAndUpdate( id, campos, {new:true} );

        res
        .status(200)
        .json({
            success: true,
            medico: medicoUpdated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error inesperado 2'
        });
    }
};

const borrarMedico = async (req, res = response) => {
    const id = req.params.id;

    try {
        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            return res.status(400).json({
                success: false,
                msg: 'ID no válido'
            });
        }

        const medicoDeleted = await Medico.findByIdAndDelete( id );

        res
        .status(200)
        .json({
            success: true,
            msg: 'Médico borrado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
};