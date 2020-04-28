// connectarnos a mongo
var mongoose = require('mongoose');
// Para poder validar los campos unicos
var uniqueValidator = require('mongoose-unique-validator');

// Para validar los roles que solo acepte admin_role o user_role
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var Schema = mongoose.Schema;

// aqui vamos a definir los campos que van a ir en nuestra tabla usuario
var usuarioSchema = new Schema({
    // [true], 'aqui va el mensaje de error'
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model('Usuario', usuarioSchema);