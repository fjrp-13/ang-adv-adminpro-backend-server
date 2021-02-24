const { Schema, model} = require('mongoose');

// Definimos el Schema para el usuario
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        require: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false,
    },
});

// Redefinimos el método "toJSON" para procesar el objeto cuando devuelva un JSON
UsuarioSchema.method('toJSON', function() {
    // Instancia al objeto, y por desestructuración:
    //   - extraemos __v
    //   - extraemos _id
    //   - extraemos password (así no "devolvemos" el password)
    //   - el resto de mi objeto, lo extraemos en object
    const { __v, _id, password, ...object} = this.toObject();

    // Creamos una nueva propiedad 'uid' que tendrá el valor del '_id' (+/- como renombrar la propiedad '_id')
    object.uid = _id;
    
    // Devolvemos nuestro objeto JSON modificado
    return object;

});

// Exportamos el Modelo de Usuario
module.exports = model('Usuario', UsuarioSchema);