const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // x-token headers Postman
    const token = req.header('x-token'); //Obtenemos el header x-token de Postman

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = uid;
        req.name = name;

    } catch (error) {
        console.log(error);
        return res.status(401).json({           
            ok: false,
            msg: 'Token no válido'
        });

    }

    next(); //Que llame lo que sigue en donde se llamó este middleware
}

module.exports = {
    validarJWT
}