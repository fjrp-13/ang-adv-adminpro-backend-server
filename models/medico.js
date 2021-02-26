const { Schema, model} = require('mongoose');

// Definimos el Schema para el médico
const MedicoSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId, // Le indica a Mongoose que va a haber una relación entre este Schema con el Schema con la siguiente referencia:
        ref: 'Usuario', // El mismo nombre con el que se exporta el modelo "Usuario" (ver el exports al final de 'models/usuario.js')
        require: true
    },
    hospital: {
        type: Schema.Types.ObjectId, // Le indica a Mongoose que va a haber una relación entre este Schema con el Schema con la siguiente referencia:
        ref: 'Hospital', // El mismo nombre con el que se exporta el modelo "Hospital" (ver el exports al final de 'models/hospital.js')
        require: true
    }
}, 
{
    collection: 'medicos' // Nombre que le damos a la colección/DB (por defecto, Mongoose le añadiría una 's' y sería 'hospitals')
});

// Redefinimos el método "toJSON" para procesar el objeto cuando devuelva un JSON
MedicoSchema.method('toJSON', function() {
    // Instancia al objeto, y por desestructuración:
    //   - extraemos __v
    //   - el resto de mi objeto, lo extraemos en object
    const { __v, _id, ...object} = this.toObject();

    // Creamos una nueva propiedad 'id' que tendrá el valor del '_id' (+/- como renombrar la propiedad '_id')
    object.id = _id;
    
    // Devolvemos nuestro objeto JSON modificado
    return object;

});

// Exportamos el Modelo de Médico
module.exports = model('Medico', MedicoSchema);