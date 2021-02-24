const jwt = require("jsonwebtoken");

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

module.exports = {
    validarJWT
};