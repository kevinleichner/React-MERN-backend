const moment = require('moment'); //Nos ayuda a validar fechas

const isDate = (value) => {
    if (!value) {
        return false;
    }

    const fecha = moment(value);

    if (fecha.isValid()) { //Validamos con moment que la fecha sea válida
        return true;
    }
    else{
        return false;
    }
}

module.exports = {
    isDate
};