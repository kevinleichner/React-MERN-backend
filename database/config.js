const mongoose = require('mongoose');


//Creamos la conexión utilizando Mongoose (Guiandonos con la documentación de su página)
const dbConnection = async() => {
    try {

        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la base de datos');
    }
}

//Exportamos la función
module.exports = {
    dbConnection
}