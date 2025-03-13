const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res) => {

    const eventos = await Evento.find() //Sin parámetros trae todos
                                .populate('user', 'name email'); //Con populate podemos traer información del usuario ya que es una llave foranea, como segundo parámetro ponemos que queremos
                                                        //traer solo el name y email, si no ponemos segundo parámetro trae todas las columnas

    res.json({
        ok:true,
        eventos
    })

}

const crearEvento = async( req, res = response) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error al intentar crear un evento'
        })
    }
}

const actualizarEvento = async( req, res = response) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;
        
        if(!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe para ese id'
            });
        }

        if (evento.user.toString() !== uid) { //Si no es el mismo usuario que creó el evento, entonces no puede actualizarlo
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body, //cargamos todo lo que vino en el body
            user: uid //agregamos el user porque no viene en el body
        }

                                              //id de evento a actualizar, nuevos datos, otras opciones (en este caso pedimos que retorne el nuevoEvento, sino retorna los viejos)
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true} ); 

        res.json({
            ok: true,
            evento: eventoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error al intentar actualizar evento'
        });     
    }    
}

const eliminarEvento = async( req, res) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;
        
        if(!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe para ese id'
            });
        }

        if (evento.user.toString() !== uid) { 
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete(eventoId); 

        res.json({
            ok: true,
            eventoEliminado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error al intentar eliminar evento'
        });     
    }
    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
