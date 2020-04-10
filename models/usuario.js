
let mongoose = require('mongoose');
let uniqueValidator = require ('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitidio'
}
let usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'Nombre requerido']},
    email: {type: String, unique:true, required: [true, 'Correo requerido']},
    password: {type: String, required: [true, 'Contraseña requerido']},
    img: {type: String, required: false},
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
})
usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe ser unico'})
module.exports = mongoose.model('Usuario', usuarioSchema);