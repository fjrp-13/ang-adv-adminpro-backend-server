// Importamos 'response' y se lo asignaremos por defecto a las respuestas, para que podamos tener la ayuda de typing/autocompleatado
const { response } = require('express');
const path = require('path'); // Para poder construir "paths's completos (viene en NodeJS)
const fs = require('fs');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

// uuid
const { v4: uuidv4 } = require('uuid');

const IMAGES_FOLDER = './uploads';
const NO_IMAGE = 'no-img.jpg';

const uploadFile = async (req, res = response) => {
    const type = req.params.type;
    const id = req.params.id;
    const allowedTypes = ['hospitales', 'medicos', 'usuarios'];

    if (!allowedTypes.includes(type)) {
        return res
        .status(400)
        .json({
            success: false,
            msg: 'Tipo incorrecto (medicos, hospitales, usuarios)',
        });
    }

    // Validar que envíen un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({success: false, msg: 'No files were uploaded.'});
    }

    // Procesar el archivo
    const file = req.files.imagen; // Tenemos acceso al "req.files" gracias al Middleware "fileupload" (routes/uploads.js --> "router.use(fileUpload)")
    const arrTemp = file.name.split('.');
    const fileExtension = arrTemp[arrTemp.length - 1];
    // Validar la extensión
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!allowedExtensions.includes(fileExtension)) {
        return res
        .status(400)
        .json({
            success: false,
            msg: `Extensiones permitidas: ${allowedExtensions.join(', ')}`,
        });
    }
    // Renombrar la imagen
    const newFilename = `${ uuidv4() }.${ fileExtension}`;
    //const uploadPath = __dirname + '/somewhere/on/your/server/' + file.name;
    const uploadPath = `${ IMAGES_FOLDER }/${ type }/${ newFilename}`;

    // return res
    // .status(400)
    // .json({
    //     success: false,
    //     newFilename,
    //     uploadPath,
    //     msg: 'ok',
    // });
    
    // Use the mv() method to place the file somewhere on your server
    // Mover el archivo
    file.mv(uploadPath, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({success: false, msg: 'Error al mover el archivo'});
        }
        // Actualizar la BD
        const ok = actualizarImagen(type, id, newFilename, IMAGES_FOLDER);

        res.status(200).json({
            success: true,
            ok,
            msg: 'Archivo cargado',
            newFilename
        });
    });
};

const getImage = async (req, res = response) => {
    const type = req.params.type;
    const image = req.params.image;

    let pathImg = path.join(__dirname, `.${ IMAGES_FOLDER }/${ type }/${ image }`);
    // return res.status(200).json({
    //     success: true,
    //     msg: 'getImage',
    //     pathImg
    // });

    // imagen por defecto
    if (!fs.existsSync(pathImg)) {
        pathImg = path.join(__dirname, `.${ IMAGES_FOLDER }/${ NO_IMAGE }`);
    }

    // Devolvemos la imagen
    res.sendFile(pathImg);
};


module.exports = {
    uploadFile,
    getImage,
};