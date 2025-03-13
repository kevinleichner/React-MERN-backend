const jwt = require('jsonwebtoken');

//Vamos a generar el JWT
const generarJWT = (uid, name) => {
    return new Promise( (resolve, reject) => {
        const payload = {uid, name}; //En el payload nunca hay que poner datos sensibles, solo datos que puedan ser públicos ya que son de fácil acceso

        jwt.sign(payload, process.env.SECRET_JWT_SEED, { //Firmamos el token que va a tener nuestro id y name usando nuestra semilla secreta
            expiresIn: '2h' //Si se firma entonces este token va a durar 2 horas
        }, (err, token) => { //Callback
            if (err) { 
                console.log(err);
                reject('No se pudo generar el token') //Si hay un error rechazamos la firma y mostramos el mensaje
            }

            resolve(token); //Si todo está bien retornamos el token
        })
    })
}

module.exports = {
    generarJWT
}