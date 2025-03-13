const {Schema, model} = require('mongoose');

//Creamos la tabla de usuarios con Mongoose
//La tabla le pusimos que es "Usuario" pero Mongoose siempre le agrega una "s" al final, eso se puede cambiar mirando la documentación.
const UsuarioSchema = Schema ({
    name: {
        type: String, //Tipo
        required: true //Obligatorio
    },
    email: {
        type: String,
        required: true,
        unique: true //PK
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model('Usuario', UsuarioSchema);