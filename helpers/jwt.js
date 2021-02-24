const jwt = require('jsonwebtoken');

const generarJWT_sin_convertir_en_Promesa = (uid) => {

    // Payload con los datos que queremos en el token
    const payload = {
        uid
    };

    const tokenOptions = {
        expiresIn: '12h'
    };
    
    // crear el token
    jwt.sign(payload, process.env.JWT_SECRET, tokenOptions, (err, token) => {
        if (err) {
            console.log(err);
        }
    });
};

// Forzamos para retornar una Promesa y poder utilizar el "jwt.sign()" como si fuera síncrono
const generarJWT = (uid) => {
    return new Promise( (resolve, reject) => {
        // Payload con los datos que queremos en el token
        const payload = {
            uid,
        };
    
        const tokenOptions = {
            expiresIn: '12h'
        };
        
        // crear el token
        jwt.sign(payload, process.env.JWT_SECRET, tokenOptions, (err, token) => {
            if (err) {
                console.log(err);
            } else {
                resolve(token);
            }
        });
    });
};

module.exports = {
    generarJWT,
};