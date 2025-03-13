const express = require('express'); //require es como un using
require('dotenv').config(); //Traemos las variables de entorno
const cors = require('cors');
const {dbConnection} = require('./database/config');

//console.log(process.env); //Ver todos los procesos en ejecución (Acá también vemos que está el PORT que agregamos en el archivo .env)

//Crear el servidor de express - Express es un servidor local
const app = express();

//Base de datos en Mongo
dbConnection();

//CORS
app.use(cors()); //CORS nos ayuda a que solamente puedan hacer peticiones a nuestra API o ciertos endpoints desde X servidores (Puede ser que Postman lo saltee, pero es una capita más de seguridad)

//Directorio Público
app.use( express.static('public') ); //app.use se ejecuta como un middleware, siempre que la aplicación haga algo. Le decimos que ejecute lo de la carpeta "public"

//Lectura y parseo del body
app.use( express.json() ); 


//Rutas
app.use('/api/auth', require('./routes/auth')); //Todo lo que el directorio routes/auth exporte, lo importa o lo muestra la ruta /api/auth

app.use('/api/events', require('./routes/events'));




//Escuchar peticiones
app.listen(process.env.PORT, () => { //El primer parámetro es el puerto en que se va a ejecutar (tratar de no usar el 3000 porque ahí se ejecuta React) digamos que ahora lo tenemos en http://localhost:4000/
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`); //El segundo parámetro es un callback que se va a ejecutar cuando el servidor se levante
});