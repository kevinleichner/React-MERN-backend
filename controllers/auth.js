const {response} = require('express'); //Esto no es para recargar express, es para no perder las referencias de "res" y lo usamos con "= response" 
// ya que sino perdemos el autocompletado.
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) => { 

    try {        
        const { email, password } = req.body; //El req tiene lo que le hayamos enviado a la petición, tiene mucha información pero en el req.body está lo que le hayamos mandado
        //como le estamos enviando name, email y password por postman entonces vamos a desestructurarlos para tenerlos por separado
        let usuario = await Usuario.findOne({ email }); //Encontrar en la tabla Usuarios si existe un registro con el email que estamos queriendo registrar
        
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body); //Le pasamos el req.body pero Mongoose busca los datos que tengan el mismo nombre que las columnas de nuestra tabla

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(); //Generamos el salt que es un conjunto de carácteres aleatorios que es lo que vamos a usar para encriptar la contraseña. Como parámetro recibe la 
                                            // cantidad de "vueltas" que va a dar para aleatorizar este salt, lo cual va a ser más seguro pero más pesado. Por defecto viene con 10
        usuario.password = bcrypt.hashSync(password, salt); //Encriptamos la password con el salt que creamos

        await usuario.save(); //Guardar el usuario en base de datos con Mongoose

        //Generar nuestro JWT (Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name); //Podemos ver si el token está verificado, la duración y demás en https://jwt.io/

        //manejo de errores
        // if (name.length < 5) { //Validación manual devolviendo un mensaje y un status 400. Pero estas validaciones si tenemos muchos campos es muchísimo código.
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'El nombre debe tener mínimo 5 letras'
        //     });
        // }   

        res.status(201).json({ 
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: 'Registro exitoso',
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error'
        })
    }
}

const loginUsuario = async(req, res = response ) => { 

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password ); //Compara la encriptación con lo ingresado

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generar nuestro JWT (Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error'
        })
    }
}

const revalidarToken = async(req, res = response ) => { 

    const {uid, name} = req;

    // generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({ 
        ok: true,
        token,
        msg: 'Revalidación de token exitosa'
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}