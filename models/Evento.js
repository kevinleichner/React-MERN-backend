const { Schema, model } = require('mongoose');

const EventoSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, //El uid del usuario
        ref: 'Usuario',
        required: true
    }
});

//Cambiar el nobmre de las "columnas" que se graban en Mongo por defecto (en este caso cambiar "_id" por "id" y quitar el "__v") ESTO ES SOLO VISUAL EN EL JSON DE RESPUESTA,
//no modifica MongoDB
EventoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);