/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const {Router}= require('express');
const {check} = require('express-validator');
const router = Router();
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// router.get('/', (req, res) => { //El '/' sería para cuando no ponen nada después de http://localhost:4000/{ruta padre si existe, en este caso api/auth}, el req lo vamos a usar si queremos pedir algo y el res para responder algo
//     res.json({  //Cuando hagan la petición a http://localhost:4000/ vamos a devolver el json con "ok: true"
//         ok: true
//     })
// });

//post(ruta, (middleware), callback)
router.post(
    '/new',
     [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(), //check(parametro, mensaje a mostrar) validaciones
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener min 6 caracteres').isLength({min: 6}),
        validarCampos
     ],
     crearUsuario); //El callback "crearUsuario" y los demás los tenemos en Controllers/auth

router.post(
    '/',
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener min 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
     loginUsuario);

router.get('/renew', validarJWT ,revalidarToken);

module.exports = router; //Exportación en Node