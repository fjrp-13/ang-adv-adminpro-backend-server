// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');

// Importamos los modelos
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const doSearch = async (req, res = response) => {
    const query = req.params.query;

    const queryRegExp = new RegExp( query, 'i');
    const [ usuarios, hospitales, medicos ] = await Promise.all([
        // https://developerslogblog.wordpress.com/2019/10/15/mongodb-how-to-filter-by-multiple-fields/
        // Usuario.find({nombre: queryRegExp}), 
        Usuario.find({
            $or: [
              {
                nombre: queryRegExp
              },
              {
                email: queryRegExp
              }
            ]
          }),
        Hospital.find({nombre: queryRegExp}),
        Medico.find({nombre: queryRegExp})
    ]); // Para que las promesas se ejecuten de manera simultánea pero que espere a que TODAS las promesas hayan finalizado

    res
    .status(200)
    .json({
        success: true,
        usuarios,
        hospitales,
        medicos,
    });
};


const doSearchByType = async (req, res = response) => {
    const type = req.params.type;
    const query = req.params.query;

    const queryRegExp = new RegExp( query, 'i');
    let data = [];

    switch (type) {
        case 'medicos':
            data = await Medico.find({nombre: queryRegExp})
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({nombre: queryRegExp})
                                .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            // data = await Usuario.find({nombre: queryRegExp});
            data = await Usuario.find({$or: [{nombre: queryRegExp}, {email: queryRegExp}]});
            break;
        default:
            return res
            .status(400)
            .json({
                success: false,
                msg: 'Tipo de búsqueda incorrecto (medicos, hospitales, usuarios)',
            });
    }

    res
    .status(200)
    .json({
        success: true,
        data,
    });
};


module.exports = {
    doSearch,
    doSearchByType,
};