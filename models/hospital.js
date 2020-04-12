const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    nombre: {type: String, required: [true, 'Nombre es requerido']},
    img: {type: String, required: false},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
}, {collection: 'hospitales'});

module.exports = mongoose.model('Hospital', hospitalSchema);