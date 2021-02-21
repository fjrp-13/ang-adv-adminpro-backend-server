const mongoose = require('mongoose');

// Con async, la función retornara una Promesa
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB online!');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD!!!');
    }

};

module.exports = {
    dbConnection
};

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));