const fs = require('fs');

// Importamos los modelos
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');


const actualizarImagen = async(type, id, filename, imagesFolder) => {
    let oldImagen = '';
    switch (type) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }
            oldImagen = `${ imagesFolder}/${type}/${medico.img}`;
            removeImagen(oldImagen);

            medico.img = filename;
            await medico.save();
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }
            oldImagen = `${ imagesFolder}/${type}/${hospital.img}`;
            removeImagen(oldImagen);

            hospital.img = filename;
            await hospital.save();
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }
            oldImagen = `${ imagesFolder}/${type}/${usuario.img}`;
            removeImagen(oldImagen);

            usuario.img = filename;
            await usuario.save();
            break;
    }
    return true;
};

const removeImagen = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

module.exports = {
    actualizarImagen
};